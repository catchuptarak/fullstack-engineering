"use client";

import React, { useState } from "react";
import { Tree } from "primereact/tree";
import { FaUserPlus } from "react-icons/fa";
import sideBarItems from "@/constants/sideBarItems";
import "./TreeView.css";
import "primereact/resources/themes/lara-light-indigo/theme.css"; // Theme
import "primereact/resources/primereact.min.css"; // Core Styles
import "primeicons/primeicons.css"; // Icons

const TreeView = () => {
  const [expandedKeys, setExpandedKeys] = useState<any>({});
  const [items, setItems] = useState(sideBarItems);

  const prepareTreeData = (items: any, level: number = 0) => {
    return items.map((item: any) => ({
      label: item.title,
      key: item.route,
      level, // Track the depth of the node
      children: item.submenu ? prepareTreeData(item.submenu, level + 1) : null,
    }));
  };

  const treeData = prepareTreeData(items);

  const onToggle = (e: any) => {
    setExpandedKeys(e.value);
  };

  const addItemToTree = (tree: any[], parentKey: string, newItem: any): any[] => {
    return tree.map((node) => {
      if (node.key === parentKey) {
        return {
          ...node,
          children: [...(node.children || []), newItem],
        };
      }
      if (node.children) {
        return {
          ...node,
          children: addItemToTree(node.children, parentKey, newItem),
        };
      }
      return node;
    });
  };

  const handleAddItem = (parentNode: any) => {
    const newItem = {
      title: `New Item`,
      route: `new-item-${Math.random().toString(36).substr(2, 9)}`,
      children: [],
    };

    if (parentNode) {
      setItems((prevItems) => addItemToTree(prevItems, parentNode.key, newItem));
    } else {
      setItems((prevItems) => [...prevItems, newItem]);
    }
  };

  return (
    <div className="w-full max-w-xs bg-gray-100 p-6 rounded-md shadow-md">
      <h1 className="text-xl font-semibold mb-4">Menu</h1>
      <Tree
        value={treeData}
        selectionMode="single"
        onToggle={onToggle}
        expandedKeys={expandedKeys}
        nodeTemplate={(node) => (
          <div
            className={`relative group ${
              node.level === 0 ? "mb-4" : "mt-2 ml-6"
            } flex items-center`}
          >
            <div className="flex items-center space-x-2">
              <span
                className={`font-bold ${
                  node.level === 0 ? "text-black text-lg" : "text-gray-600 text-base"
                }`}
              >
                {node.label}
              </span>
            </div>
            <div className="absolute top-0 right-0 hidden group-hover:block">
              <button
                className="p-2 bg-blue-500 text-white rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddItem(node);
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
