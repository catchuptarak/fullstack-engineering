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
  selectedNodeId: number;
  onSubmit: (node: Node) => void; // Callback to handle submission
  onCancel: () => void; // Callback to cancel the form
  onDelete: (key: string) => void; // Callback to handle node deletion
  mode: string;
  triggerKey: string | null; // New prop.
  setSelectedNode: any;
}

const AddEditNode: React.FC<AddEditNodeProps> = ({
  selectedNode,
  treeData,
  selectedNodeId,
  onSubmit,
  onCancel,
  onDelete,
  mode,
  triggerKey,
  setSelectedNode,
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
    console.log("selectedNodeId", selectedNodeId);

    if (triggerKey) {
      if (selectedNode) {
        // Check if selectedNode.parent is valid
        console.log("selectedNode.parent", Number(selectedNode.parent));

        // Find the parent node by ID in treeData
        const parentId =
          Number(selectedNode.parent) || Number(selectedNode.parentId);
        const parentNode = findNodeById(treeData, parentId);

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
        console.log("useEffect Add", selectedNodeId, treeData);
        const selectedNodeForAdd = findNodeById(treeData, selectedNodeId);

        console.log("useEffect Add selectedNode", selectedNode);
        setFormData({
          key: "",
          label: "",
          depth: 0,
          parent: "",
          parentName: selectedNodeForAdd ? selectedNodeForAdd.label : "",
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

  const findNodeById = (data: Node[], id: number): Node | null => {
    for (const node of data) {
      if (Number(node.key) === id) {
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

    console.log(`handleSubmit  selectedNodeId: ${selectedNodeId}`);

    if (formData.label.trim() === "") return;

    // Find the parent node from treeData based on parentName

    // const parentNode = findNodeById(treeData, parentId);

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    console.log("process.env", process.env);

    // API URL for adding or editing a node
    let apiUrl = "";

    try {
      // If selectedNode exists, it means we are editing an existing node, so use PUT
      if (selectedNode) {
        if (!selectedNode.key) {
          alert("Parent node not found");
          return;
        }

        // Prepare new node dat

        const requestData = {
          name: formData.label,
        };
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
        console.log(
          `updatedNode successfully with updatedNode : ${JSON.stringify(
            updatedNode
          )}`
        );
        console.log(`updatedNode treeData : ${JSON.stringify(treeData)}`);

        const updatedParentNode = findNodeById(treeData, updatedNode.parentId);

        // Ensure the updated node has the correct parent name
        // const updatedParentNode = treeData.find(
        //   (node) => node.key === updatedNode.parent
        // );
        console.log(
          `updatedNode successfully with updatedParentNode : ${JSON.stringify(
            updatedParentNode
          )}`
        );
        const updatedNodeWithParent = {
          ...updatedNode,
          parentName: updatedParentNode ? updatedParentNode.label : "",
        };
        delete updatedNode.createdAt;
        delete updatedNode.updatedAt;
        setSelectedNode(updatedNode);
        console.log(
          `updatedNode successfully with updatedNodeWithParent : ${JSON.stringify(
            updatedNodeWithParent
          )}`
        );

        onSubmit(updatedNodeWithParent); // Update the tree with the new data
      } else {
        const selectedNodeForAdd = findNodeById(treeData, selectedNodeId);
        if (!selectedNodeForAdd) {
          alert("Parent node not found");
          return;
        }

        // Prepare new node dat

        const requestDataAdd = {
          name: formData.label,
          parentId: selectedNodeForAdd.key,
        };
        console.log(
          `handleSubmit  requestDataAdd: ${requestDataAdd} ${JSON.stringify(
            selectedNodeForAdd
          )}`
        );
        // If selectedNode doesn't exist, we are adding a new node, so use POST
        apiUrl = `${apiBaseUrl}/menu/add`;
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestDataAdd),
        });

        if (!response.ok) {
          throw new Error("Failed to add new node");
        }

        const addedNode = await response.json();
        alert("New node added successfully");
        setSelectedNode(addedNode);
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
