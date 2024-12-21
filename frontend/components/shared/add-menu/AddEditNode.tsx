import React, { useState, useEffect } from "react";

interface Node {
  key: string;
  label: string;
  depth: number;
  parent: string; // Parent Node ID
  parentId: number; // Parent Node ID
  children?: Node[];
}

interface AddEditNodeProps {
  selectedNode: Node | null; // The node to edit, or null for adding a new node
  treeData: Node[]; // Full tree data to look up the parent node by ID,
  selectedParentId: number;
  onSubmit: (node: Node) => void; // Callback to handle submission
  onCancel: () => void; // Callback to cancel the form
  onDelete: (key: string) => void; // Callback to handle node deletion
  mode: string;
  triggerKey: string | null; // New prop
}

const AddEditNode: React.FC<AddEditNodeProps> = ({
  selectedNode,
  treeData,
  selectedParentId,
  onSubmit,
  onCancel,
  onDelete,
  mode,
  triggerKey
}) => {
  console.log("AAddEditNode trigerred", selectedNode);

  const [formData, setFormData] = useState({
    key: "",
    label: "",
    depth: 0,
    parent: "",
    parentName: "", // New field to display parent node name
  });

  useEffect(() => {
    console.log("useEffect");
    console.log("AddEditNode useEffect selectedNode ", selectedNode);
    console.log("selectedParentId", selectedParentId);

    if(triggerKey){

      if (selectedNode) {
        // Check if selectedNode.parent is valid
        console.log("selectedNode.parent", selectedNode.parent);
  
        // Find the parent node by ID in treeData
        const parentNode = treeData.find((node) =>
          selectedNode.parent
            ? node.key === selectedNode.parent
            : Number(node.key) == selectedNode.parentId
        );
        console.log("parentNode", parentNode);
  
        // Edit mode: Populate form with selected node's data
        setFormData({
          key: selectedNode.key,
          label: selectedNode.label,
          depth: selectedNode.depth,
          parent: selectedNode.parent,
          parentName: parentNode ? parentNode.label : "", // Use parent's label or empty string if no parent
        });
      } else {
        // Add mode: Reset the form with default values
        console.log("else....", selectedParentId, treeData)
        const parentNode = treeData.find((node) =>
        Number(node.key) == selectedParentId
      );
      console.log("parentNode", parentNode);
        setFormData({
          key: "",
          label: "",
          depth: 0,
          parent: "",
          parentName: parentNode ? parentNode.label : "",
        });
      }

    }

   
  }, [selectedNode, treeData, triggerKey]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const findNodeById = (data: Node[], id: string): Node | null => {
    for (const node of data) {
      if (node.key === id) {
        return {
          key: node.key,
          label: node.label,
          depth: node.depth,
          parent: node.parent,
          parentId: node.parentId,
          children: node.children,
        };
      }
      if (node.children && node.children.length > 0) {
        const result = findNodeById(node.children, id);
        if (result) return result;
      }
    }
    return null; // If no matching node is found
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.label.trim() === "") return;

    // Find the parent node from treeData based on parentName
    const parentNode =
      treeData.find((node) => node.label === formData.parentName) ||
      treeData.find((node) => node.key === selectedNode?.key);
    if (!parentNode && formData.parentName !== "0") {
      alert("Parent node not found");
      return;
    }

    // Prepare new node data
    const newNode: Node = {
      key: selectedNode ? selectedNode.key : formData.label,
      label: formData.label,
      depth: selectedNode
        ? formData.depth
        : parentNode
        ? parentNode.depth + 1
        : 0, // Depth is 0 if no parent exists
      parent: parentNode ? parentNode.key : "", // Store Parent Node ID
      children: selectedNode?.children || [],
    };

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    console.log("process.env", process.env);

    // API URL for adding or editing a node
    let apiUrl = "";
    let requestData = {
      name: formData.label,
    };

    try {
      // If selectedNode exists, it means we are editing an existing node, so use PUT
      if (selectedNode) {
        apiUrl = `${apiBaseUrl}/menu/${selectedNode.key}`;
        console.log("apiUrl", apiUrl);
        const response = await fetch(apiUrl, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });

        if (!response.ok) {
          throw new Error("Failed to update node");
        }

        const updatedNode = await response.json();
        alert("Node updated successfully");
        console.log(`updatedNode successfully with updatedNode : ${JSON.stringify(updatedNode)}`);
        console.log(`updatedNode treeData : ${JSON.stringify(treeData)}`)

        const updatedParentNode = findNodeById(treeData, updatedNode.parentId)


        // Ensure the updated node has the correct parent name
        // const updatedParentNode = treeData.find(
        //   (node) => node.key === updatedNode.parent
        // );
        console.log(`updatedNode successfully with updatedParentNode : ${JSON.stringify(updatedParentNode)}`)
        const updatedNodeWithParent = {
          ...updatedNode,
          parentName: updatedParentNode ? updatedParentNode.label : "",
        };
        console.log(`updatedNode successfully with updatedNodeWithParent : ${JSON.stringify(updatedNodeWithParent)}`)

        onSubmit(updatedNodeWithParent); // Update the tree with the new data
      } else {
        // If selectedNode doesn't exist, we are adding a new node, so use POST
        apiUrl = `${apiBaseUrl}/menu`;
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });

        if (!response.ok) {
          throw new Error("Failed to add new node");
        }

        const addedNode = await response.json();
        alert("New node added successfully");
        onSubmit(addedNode); // Add the new node to the tree
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while submitting the form");
    }
  };

  const handleDelete = () => {
    if (selectedNode) onDelete(selectedNode.key);
  };

  return (
    <div className="p-6 bg-white rounded-md shadow-md mt-4 w-96 mx-auto">
      <h2 className="text-xl font-semibold mb-6">
        {selectedNode ? "Edit Node" : "Add Node"}
      </h2>
      <form onSubmit={handleSubmit}>
        {selectedNode && (
          <div className="mb-6">
            <label htmlFor="key" className="block text-gray-700 text-lg mb-2">
              Node ID
            </label>
            <input
              type="text"
              id="key"
              name="key"
              value={formData.key}
              className="w-full p-3 bg-gray-100 text-gray-500 border border-gray-300 rounded text-lg cursor-not-allowed"
              readOnly // Makes Node ID non-editable
            />
          </div>
        )}

        <div className="mb-6">
          <label htmlFor="label" className="block text-gray-700 text-lg mb-2">
            Node Label
          </label>
          <input
            type="text"
            id="label"
            name="label"
            value={formData.label}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded text-lg"
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="parentName"
            className="block text-gray-700 text-lg mb-2"
          >
            Parent Node Name
          </label>
          <input
            type="text"
            id="parentName"
            name="parentName"
            value={formData.parentName}
            className="w-full p-3 bg-gray-100 text-gray-500 border border-gray-300 rounded text-lg cursor-not-allowed"
            readOnly // Makes Parent Node Name non-editable
          />
        </div>

        {selectedNode && (
          <div className="mb-6">
            <label htmlFor="depth" className="block text-gray-700 text-lg mb-2">
              Depth
            </label>
            <input
              type="number"
              id="depth"
              name="depth"
              value={formData.depth}
              className="w-full p-3 bg-gray-100 text-gray-500 border border-gray-300 rounded text-lg cursor-not-allowed"
              readOnly // Makes Depth non-editable
            />
          </div>
        )}

        <div className="flex justify-between">
          {selectedNode && (
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-500 text-white p-3 rounded text-lg ml-4"
            >
              Delete
            </button>
          )}
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 text-white p-3 rounded text-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white p-3 rounded text-lg"
          >
            {selectedNode ? "Update" : "Add"} Node
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditNode;
