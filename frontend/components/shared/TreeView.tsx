"use client";

import React, { useEffect, useState } from "react";
import { Tree } from "primereact/tree";
import { FaUserPlus } from "react-icons/fa";
import { TiUser } from "react-icons/ti";
import "./TreeView.css"; // Optional: Custom CSS for styling

const TreeView = () => {
  const [expandedKeys, setExpandedKeys] = useState<any>({});
  const [treeData, setTreeData] = useState<any[]>([]);

  // Fetch tree data from the API
  const fetchTreeData = async () => {
    try {
      const response = await fetch("http://localhost:4000/menu/all");
      if (!response.ok) {
        throw new Error("Failed to fetch tree data");
      }
      const data = await response.json();
      const preparedData = prepareTreeData(data);
      setTreeData(preparedData);
    } catch (error) {
      console.error("Error fetching tree data:", error);
    }
  };

  // Prepare the tree data to be compatible with PrimeReact's Tree component
  const prepareTreeData = (items: any) => {
    return items.map((item: any) => ({
      key: item.id, // Unique key for each node
      label: item.name, // Displayed name
      children: item.children ? prepareTreeData(item.children) : [], // Recursively map children
    }));
  };

  useEffect(() => {
    fetchTreeData();
  }, []);

  const onToggle = (e: any) => {
    setExpandedKeys(e.value); // Update the expanded state when a node is toggled
  };

  const handleAddItem = (node: any) => {
    console.log("Add new node to:", node);
    // Implement functionality to add new nodes
  };

  return (
    <div className="w-full max-w-lg bg-gray-100 p-6 rounded-md shadow-md">
      <h1 className="text-xl font-semibold mb-4">Menu</h1>
      <Tree
        value={treeData} // Pass the prepared tree data
        selectionMode="single" // Single selection mode
        onToggle={onToggle} // Handle toggle events to expand/collapse
        expandedKeys={expandedKeys} // Bind the expanded state to control which nodes are expanded
        className="border-none custom-tree" // Apply custom styling
        nodeTemplate={(node) => (
          <div className="relative group">
            <div className="flex items-center">
              <span className="mr-2">
                <TiUser className="text-blue-500 text-xl" />
              </span>
              {node.label}
            </div>

            {/* Add button */}
            <div className="absolute top-0 right-0 hidden group-hover:block">
              <button
                className="p-2 bg-blue-500 text-white rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddItem(node); // Handle adding items
                }}
              >
                <FaUserPlus />
              </button>
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default TreeView;
