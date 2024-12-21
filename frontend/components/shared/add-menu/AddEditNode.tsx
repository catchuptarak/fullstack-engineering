import React, { useState, useEffect } from "react";

interface Node {
  key: string;
  label: string;
  depth: number;
  parent: string; // Parent Node ID
  children?: Node[];
}

interface AddEditNodeProps {
  selectedNode: Node; // The node to edit, or null for adding a new node
  treeData: Node[]; // Full tree data to look up the parent node by ID
  onSubmit: (node: Node) => void; // Callback to handle submission
  onCancel: () => void; // Callback to cancel the form
  onDelete: (key: string) => void; // Callback to handle node deletion
  mode: string
}

const AddEditNode: React.FC<AddEditNodeProps> = ({
  selectedNode,
  treeData,
  onSubmit,
  onCancel,
  onDelete,
  mode
}) => {
  console.log('AddEditNode selectedNode', selectedNode);
  const [formData, setFormData] = useState({
    key: "",
    label: "",
    depth: 0,
    parent: "",
    parentName: "", // New field to display parent node name
  });

  useEffect(() => {
    console.log('AddEditNode useEffect selectedNode', selectedNode);
   
    // 
    if (selectedNode) {
      const parentNode = treeData.find((node) => node.key === selectedNode.parent); // Find parent by ID
      console.log('parentNode', parentNode);
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
      const parentNode = treeData.find((node) => node.key === selectedNode?.parent);
      console.log('parentNode', parentNode);
      setFormData({
        key: "",
        label: "",
        depth: 0,
        parent: "",
        parentName: parentNode ? parentNode.label : "",
      });
    }
  }, [selectedNode, treeData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (formData.label.trim() === "") return;
  
    // Find the parent node
    const parentNode = treeData.find((node) => node.label === formData.parentName);
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
    console.log('process.env', process.env);
    // API URL for adding or editing a node
    let apiUrl = '';
    let requestData = {
      name: formData.label,
    };
  
    try {
      // If selectedNode exists, it means we are editing an existing node, so use PUT
      if (selectedNode) {
        apiUrl = `${apiBaseUrl}/menu/${selectedNode.key}`;
        console.log('apiUrl', apiUrl);
        const response = await fetch(apiUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });
  
        if (!response.ok) {
          throw new Error('Failed to update node');
        }
  
        const updatedNode = await response.json();
        alert("Node updated successfully");
        onSubmit(updatedNode); // Update the tree with the new data
      } else {
        // If selectedNode doesn't exist, we are adding a new node, so use POST
        apiUrl = 'http://localhost:4000/menu';
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });
  
        if (!response.ok) {
          throw new Error('Failed to add new node');
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
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded text-lg"
              readOnly
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
          <label htmlFor="parentName" className="block text-gray-700 text-lg mb-2">
            Parent Node Name
          </label>
          <input
            type="text"
            id="parentName"
            name="parentName"
            value={formData.parentName}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded text-lg"
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
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded text-lg"
              required
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
          <button type="submit" className="bg-blue-500 text-white p-3 rounded text-lg">
            {selectedNode ? "Update" : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditNode;
