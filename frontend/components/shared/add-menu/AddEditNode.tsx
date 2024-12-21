import React, { useState, useEffect } from "react";

// Interface for node data
interface Node {
  key: string;
  label: string;
  depth: number;
  parent: string; // Parent Node Name
  children?: Node[];
}

interface AddEditNodeProps {
  selectedNode: Node | null; // The node to edit, or null for adding a new node
  treeData: Node[]; // Full tree data to look up the parent node by name
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
    key: selectedNode ? selectedNode.key : "",
    label: selectedNode ? selectedNode.label : "",
    parent: selectedNode ? selectedNode.parent : "",
    depth: selectedNode ? selectedNode.depth : 0,
  });

  const [selectedNodeState, setSelectedNodeState] = useState<Node | null>(selectedNode);

  useEffect(() => {
    if (selectedNode) {
      setFormData({
        key: selectedNode.key,
        label: selectedNode.label,
        parent: selectedNode.parent,
        depth: selectedNode.depth,
      });
      setSelectedNodeState(selectedNode); // Update internal state when selectedNode changes
    }
  }, [selectedNode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "depth" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.label.trim() === "") return;

    const parentNode = treeData.find((node) => node.label === formData.parent);
    if (!parentNode && formData.parent !== "") {
      alert("Parent node not found");
      return;
    }

    const newNode: Node = {
      key: selectedNode ? selectedNode.key : formData.label, // Use label as key if adding a new node
      label: formData.label,
      depth: selectedNode ? formData.depth : 0, // Depth defaults to 0 for new nodes
      parent: parentNode ? parentNode.label : "",
      children: selectedNode?.children || [],
    };

    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL; // Access the base URL from the environment

    try {
      if (selectedNode) {
        // Edit mode: Call PUT API to update the existing node
        const response = await fetch(`${apiBaseUrl}/menu/${selectedNode.key}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.label,
            parentId: parentNode ? parentNode.key : null,
            depth: formData.depth,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update node");
        }

        alert("Node updated successfully");
      } else {
        // Add mode: Call POST API to add a new node
        const response = await fetch(`${apiBaseUrl}/menu/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.label,
            parentId: parentNode ? parentNode.key : null,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to add new node");
        }

        alert("New node added successfully");
      }

      // Reset the form after submission
      setFormData({ key: "", label: "", parent: "", depth: 0 });
      setSelectedNodeState(null); // Reset selected node state internally
    } catch (error) {
      console.error(error);
      alert("An error occurred while submitting the form");
    }
  };

  const handleDelete = () => {
    if (selectedNodeState) {
      onDelete(selectedNodeState.key); // Trigger delete callback with node key
    }
  };

  return (
    <div className="p-6 bg-white rounded-md shadow-md mt-4 w-96 mx-auto">
      <h2 className="text-xl font-semibold mb-6">
        {selectedNodeState ? "Edit Node" : "Add Node"}
      </h2>
      <form onSubmit={handleSubmit}>
        {selectedNodeState && (
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
              readOnly // Node ID should not be editable
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
          <label htmlFor="parent" className="block text-gray-700 text-lg mb-2">
            Parent Node Name
          </label>
          <input
            type="text"
            id="parent"
            name="parent"
            value={formData.parent}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded text-lg"
          />
        </div>

        {selectedNodeState && (
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
          {selectedNodeState && (
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
            {selectedNodeState ? "Update" : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditNode;
