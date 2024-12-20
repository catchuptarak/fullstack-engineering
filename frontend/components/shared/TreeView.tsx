"use client";

import React, { useState } from "react";
import { Tree } from "primereact/tree";
import { FaUserPlus } from "react-icons/fa";
import { TiHome, TiUser } from "react-icons/ti";
import sideBarItems from "@/constants/sideBarItems";
import "./TreeView.css";
import "primereact/resources/themes/lara-light-indigo/theme.css"; // Theme
import "primereact/resources/primereact.min.css"; // Core Styles
import "primeicons/primeicons.css"; // Icons

const TreeView = () => {
  const [expandedKeys, setExpandedKeys] = useState<any>({});
  const [items, setItems] = useState(sideBarItems); // Store items in state to add new ones dynamically

  const prepareTreeData = (items: any) => {
    return items.map((item: any) => ({
      label: item.title, // Label for the tree item
      key: item.route, // Unique key for each item
      children: item.submenu ? prepareTreeData(item.submenu) : null, // Recursively handle submenus
    }));
  };

  const treeData = prepareTreeData(items);

  const onToggle = (e: any) => {
    setExpandedKeys(e.value); // Update the expanded state when a node is toggled
  };

  const addItemToTree = (tree: any[], parentKey: string, newItem: any): any[] => {
    return tree.map((node) => {
      if (node.key === parentKey) {
        return {
          ...node,
          submenu: [...(node.submenu || []), newItem], // Add new item immutably
        };
      }
      if (node.submenu) {
        return {
          ...node,
          submenu: addItemToTree(node.submenu, parentKey, newItem), // Recursively traverse children
        };
      }
      return node;
    });
  };

  const handleAddItem = (parentNode: any) => {
    const newItem = {
      title: `New Item`,
      route: `new-item-${Math.random().toString(36).substr(2, 9)}`,
      submenu: [],
    };

    if (parentNode) {
      setItems((prevItems) => addItemToTree(prevItems, parentNode.key, newItem));
    } else {
      setItems((prevItems) => [...prevItems, newItem]); // If no parent, add to root
    }
  };

  return (
    <div className="w-full max-w-xs bg-gray-100 p-6 rounded-md shadow-md">
      <h1 className="text-xl font-semibold mb-4">Menu</h1>
      <Tree
        value={treeData} // Pass the prepared tree data
        selectionMode="single" // Single selection mode
        onToggle={onToggle} // Handle toggle events to expand/collapse
        expandedKeys={expandedKeys} // Bind the expanded state to control which nodes are expanded
        selectionKeys={expandedKeys} // Bind selected keys if needed (for single selection)
        onSelect={(e) => console.log("Selected node:", e.value)} // Log selected node
        className="border-none custom-tree" // Apply custom styling
        nodeTemplate={(node) => (
          <div className="relative group">
            <div className="flex items-center">
              {/* Render the icon only in the template */}
              {node.icon ? <TiUser className="mr-2 text-xl" /> : null}
              {node.label}
            </div>

            {/* Plus button for adding a new item */}
            <div className="absolute top-0 right-0 hidden group-hover:block">
              <button
                className="p-2 bg-blue-500 text-white rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddItem(node); // Add item when clicked
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
