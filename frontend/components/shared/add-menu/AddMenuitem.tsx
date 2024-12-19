"use client";

import React, { useState } from "react";

interface AddMenuItemProps {
  onSubmit: (newMenuItem: MenuItem) => void; // Callback to handle form submission
  parentData: any; // To help with parent data if needed (could be an existing node)
  depth: number; // Current depth level in the tree (helps with nesting)
}

interface MenuItem {
  menuid: string;
  depth: number;
  parentdata: any;
  name: string;
}

const AddMenuItem: React.FC<AddMenuItemProps> = ({ onSubmit, parentData, depth }) => {
  // Form state management
  const [menuid, setMenuid] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [parentdata, setParentData] = useState<any>(parentData); // Parent data reference
  const [depthLevel, setDepth] = useState<number>(depth); // Current depth

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Construct the new menu item object
    const newMenuItem: MenuItem = {
      menuid,
      depth: depthLevel,
      parentdata,
      name,
    };

    // Submit the new menu item
    onSubmit(newMenuItem);

    // Reset the form after submission
    setMenuid("");
    setName("");
  };

  return (
    <div className="add-menu-item">
      <h3>Add New Menu Item</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="menuid">Menu ID</label>
          <input
            type="text"
            id="menuid"
            value={menuid}
            onChange={(e) => setMenuid(e.target.value)}
            required
            placeholder="Enter unique Menu ID"
          />
        </div>

        <div className="form-group">
          <label htmlFor="name">Menu Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter Menu Name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="depth">Depth</label>
          <input
            type="number"
            id="depth"
            value={depthLevel}
            onChange={(e) => setDepth(Number(e.target.value))}
            required
            min="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="parentdata">Parent Data</label>
          <input
            type="text"
            id="parentdata"
            value={parentdata ? parentdata.label : ""}
            onChange={(e) => setParentData(e.target.value)} // Handle parent data update
            required
            placeholder="Enter Parent Data"
          />
        </div>

        <button type="submit" className="btn-submit">Add Menu Item</button>
      </form>
    </div>
  );
};

export default AddMenuItem;
