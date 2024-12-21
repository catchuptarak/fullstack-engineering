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
}

const AddEditNode: React.FC<AddEditNodeProps> = ({
  selectedNode,
  treeData,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    key: selectedNode ? selectedNode.key : "",
    label: selectedNode ? selectedNode.label : "",
    depth: selectedNode ? selectedNode.depth : 0,
    parent: selectedNode ? selectedNode.parent : "",
  });

  useEffect(() => {
    if (selectedNode) {
      setFormData({
        key: selectedNode.key,
        label: selectedNode.label,
        depth: selectedNode.depth,
        parent: selectedNode.parent,
      });
    }
  }, [selectedNode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "depth" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.label.trim() === "" || formData.key.trim() === "") return;

    const parentNode = treeData.find((node) => node.label === formData.parent);
    if (!parentNode && formData.parent !== "") {
      alert("Parent node not found");
      return;
    }

    const newNode: Node = {
      key: selectedNode ? selectedNode.key : formData.key,
      label: formData.label,
      depth: formData.depth,
      parent: parentNode ? parentNode.label : "",
      children: selectedNode?.children || [],
    };

    onSubmit(newNode);
    setFormData({ key: "", label: "", depth: 0, parent: "" });
  };

  return (
    <div className="p-4 bg-white rounded-md shadow-md mt-4">
      <h2 className="text-lg font-semibold mb-4">
        {selectedNode ? "Edit Node" : "Add Node"}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="key" className="block text-gray-700 mb-1">
            Node ID
          </label>
          <input
            type="text"
            id="key"
            name="key"
            value={formData.key}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="label" className="block text-gray-700 mb-1">
            Node Label
          </label>
          <input
            type="text"
            id="label"
            name="label"
            value={formData.label}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="depth" className="block text-gray-700 mb-1">
            Depth
          </label>
          <input
            type="number"
            id="depth"
            name="depth"
            value={formData.depth}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="parent" className="block text-gray-700 mb-1">
            Parent Node Name
          </label>
          <input
            type="text"
            id="parent"
            name="parent"
            value={formData.parent}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="flex justify-between">
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            {selectedNode ? "Update" : "Add"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 text-white p-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditNode;
