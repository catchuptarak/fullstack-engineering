"use client";

import React, { useState, useEffect } from "react";

interface AddEditFormProps {
  initialData?: {
    menuId: string;
    depth: number;
    parentData: string;
    name: string;
  };
  onSubmit: (data: {
    menuId: string;
    depth: number;
    parentData: string;
    name: string;
  }) => void;
}

const AddEditForm: React.FC<AddEditFormProps> = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = useState({
    menuId: "",
    depth: 0,
    parentData: "",
    name: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "depth" ? parseInt(value) : value, // Convert depth to a number
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      menuId: "",
      depth: 0,
      parentData: "",
      name: "",
    }); // Reset form after submission
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">
        {initialData ? "Edit Item" : "Add Item"}
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Menu ID */}
        <div className="mb-4">
          <label htmlFor="menuId" className="block text-gray-700 font-medium mb-1">
            Menu ID
          </label>
          <input
            type="text"
            id="menuId"
            name="menuId"
            value={formData.menuId}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        {/* Depth */}
        <div className="mb-4">
          <label htmlFor="depth" className="block text-gray-700 font-medium mb-1">
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

        {/* Parent Data */}
        <div className="mb-4">
          <label htmlFor="parentData" className="block text-gray-700 font-medium mb-1">
            Parent Data
          </label>
          <input
            type="text"
            id="parentData"
            name="parentData"
            value={formData.parentData}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        {/* Name */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddEditForm;
