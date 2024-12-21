import React, { useState, useEffect } from "react";

interface Node {
  key: string;
  label: string;
  depth: number;
  parent: string; // Parent Node ID
  children?: Node[];
}

interface AddEditNodeProps {
  selectedNode: Node | null; // The node to edit, or null for adding a new node
  treeData: Node[]; // Full tree data to look up the parent node by ID
  onSubmit: (node: Node) => void; // Callback to handle submission
  onCancel: () => void; // Callback to cancel the form
  onDelete: (key: string) => void; // Callback to handle node deletion
}

const AddEditNode: React.FC<AddEditNodeProps> = ({
  selectedNode,
  treeData,
  onSubmit,
  onCancel,
  onDelete,
}) => {
  const [formData, setFormData] = useState({
    key: "",
    label: "",
    depth: 0,
    parent: "",
    parentName: "", // New field to display parent node name
  });

  useEffect(() => {
    if (selectedNode) {
      console.log('selectedNode', selectedNode);
      // Edit mode: Populate form with selected node's data
      const parentNode = treeData.find((node) => node.key === selectedNode.parent); // Find parent by ID
      setFormData({
        key: selectedNode.key,
        label: selectedNode.label,
        depth: selectedNode.depth,
        parent: selectedNode.parent,
        parentName: parentNode ? parentNode.label : "", // Use parent's label or empty string if no parent
      });
    } else {
      // Add mode: Reset the form with default values
      setFormData({
        key: "",
        label: "",
        depth: 0,
        parent: "",
        parentName: "", // Default to an empty string
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

    const parentNode = treeData.find((node) => node.label === formData.parentName);
    if (!parentNode && formData.parentName !== "0") {
      alert("Parent node not found");
      return;
    }

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

    try {
      alert(selectedNode ? "Node updated successfully" : "New node added successfully");
      onSubmit(newNode);
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
