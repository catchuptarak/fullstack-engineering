"use client";

import React, { useEffect, useState } from "react";
import { Tree } from "primereact/tree";
import { FaUserPlus, FaEdit } from "react-icons/fa"; // Plus and Edit Icons
import AddEditNode from "./add-menu/AddEditNode"; // Import AddEditNode
import "./TreeView.css"; // Import custom CSS file

interface Node {
  key: string;
  label: string;
  depth: number;
  parent: string;
  children?: Node[];
}

const TreeView = () => {
  const [expandedKeys, setExpandedKeys] = useState<any>({});
  const [treeData, setTreeData] = useState<Node[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [triggerKey, setTriggerKey] = useState<string | null>(null); // New state for trigger key

  const fetchTreeData = async () => {
    try {
      const response = await fetch("http://localhost:4000/menu/all");
      if (!response.ok) throw new Error("Failed to fetch tree data");

      const data = await response.json();
      setTreeData(prepareTreeData(data));
    } catch (error) {
      console.error("Error fetching tree data:", error);
    }
  };

  const prepareTreeData = (items: any) =>
    items.map((item: any) => ({
      key: item.id,
      label: item.name,
      depth: item.depth || 0,
      parent: item.parentId || "",
      children: item.children ? prepareTreeData(item.children) : [],
    }));

  useEffect(() => {
    fetchTreeData();
  }, []);

  const onToggle = (e: any) => setExpandedKeys(e.value);

  const handleCancel = () => {
    // Reset any modal or form visibility
    setSelectedNode(null); // Close the form without changes
    setSelectedNodeId(null); // Reset parent ID on cancel
    console.log("Cancel action triggered, form reset.");
  };

  const handleDelete = (node: Node) => {
    const deleteNodeAndChildren = (
      nodes: Node[],
      keyToDelete: string
    ): Node[] => {
      return nodes
        .filter((node) => node.key !== keyToDelete) // Remove the node with the matching key
        .map((node) => ({
          ...node,
          children: deleteNodeAndChildren(node.children || [], keyToDelete), // Recursively remove children
        }));
    };

    setTreeData((prev) => deleteNodeAndChildren(prev, node.key));
    setSelectedNode(null); // Clear selected node after deletion
    setSelectedNodeId(null); // Reset selected node ID
  };

  const handleAddItem = (node: Node) => {
    console.log("Adding new node to:", node);
    setSelectedNodeId(node.key); //
    setSelectedNode(null); // Reset selected node to ensure no pre-selected node
    setMode("add"); // Set mode to 'add'
    setTriggerKey(Date.now().toString()); // Update trigger key with a unique value
  };

  const handleEditNode = (node: Node) => {
    console.log("Editing node:", node);
    setSelectedNodeId(null); // Reset selected parent ID since it's an edit operation
    setSelectedNode(node); // Set the selected node for editing
    setMode("edit"); // Set mode to 'edit'
    setTriggerKey(Date.now().toString()); // Update trigger key with a unique value
  };

  const handleSubmitNode = (node: Node) => {
    setTreeData((prev) => {
      if (selectedNode) {
        return prev.map((n) =>
          n.key === selectedNode.key ? { ...n, ...node } : n
        );
      } else {
        return [
          ...prev,
          {
            ...node,
            parent: selectedNodeId || "", // Attach selectedParentId for the new node
          },
        ];
      }
    });

    fetchTreeData(); // Refresh the tree data after adding or editing a node
  };

  return (
    <div className="flex w-full">
      {/* Tree View Section */}
      <div className="tree-view-container w-2/3 pr-4">
        <h1 className="text-xl font-semibold mb-4">Menu</h1>
        <Tree
          value={treeData}
          selectionMode="single"
          onToggle={onToggle}
          expandedKeys={expandedKeys}
          className="custom-tree"
          nodeTemplate={(node) => (
            <div className="node-content relative group p-2 flex items-center justify-between">
              <span className="mr-2">{node.label}</span>
              <div className="button-container flex items-center gap-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  className="p-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddItem(node); // Handle adding items
                  }}
                >
                  <FaUserPlus />
                </button>
                <button
                  className="p-2 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditNode(node); // Handle editing node
                  }}
                >
                  <FaEdit />
                </button>
              </div>
            </div>
          )}
        />
      </div>

      {/* Add/Edit Node Section */}
      <div className="add-edit-section w-1/3">
        <AddEditNode
          selectedNode={selectedNode}
          treeData={treeData}
          selectedNodeId={selectedNodeId}
          onSubmit={handleSubmitNode}
          onCancel={handleCancel}
          onDelete={handleDelete}
          mode={mode}
          triggerKey={triggerKey}
          setSelectedNode={setSelectedNode}
        />
      </div>
    </div>
  );
};

export default TreeView;
