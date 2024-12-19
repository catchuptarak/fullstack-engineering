"use client";

import React, { useState } from "react";
import { Tree } from "primereact/tree";
import { FaUserPlus } from "react-icons/fa";
import { TiHome, TiUser } from "react-icons/ti";
import sideBarItems from "@/constants/sideBarItems";
import "./TreeView.css"
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // Theme
import 'primereact/resources/primereact.min.css';  // Core Styles
import 'primeicons/primeicons.css';  // Icons

// Prepare the tree data for PrimeReact's Tree component
const TreeView = () => {
  const [expandedKeys, setExpandedKeys] = useState<any>({});

  const prepareTreeData = (items: any) => {
    return items.map((item: any) => ({
      label: item.title, // Label for the tree item
      key: item.route,   // Unique key for each item
      icon: item.Icon ? <item.Icon className="text-xl" /> : null, // Render icon as JSX
      children: item.submenu ? prepareTreeData(item.submenu) : null, // Recursively handle submenus
    }));
  };

  const treeData = prepareTreeData(sideBarItems);

  const onToggle = (e: any) => {
    setExpandedKeys(e.value); // Update the expanded state when a node is toggled
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
      />
    </div>
  );
};

export default TreeView;
