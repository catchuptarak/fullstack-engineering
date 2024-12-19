"use client";

import React, { useState } from "react";
import sideBarItems from "@/constants/sideBarItems";
import Link from "next/link";


const TreeView = () => {
    const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
      {}
    );
  
    const toggleExpand = (title: string) => {
      setExpandedItems((prev) => ({
        ...prev,
        [title]: !prev[title],
      }));
    };
  
    const renderMenu = (item: any, level: number) => {
      const hasSubmenu = item.submenu && item.submenu.length > 0;
      const isExpanded = expandedItems[item.title];
  
      return (
        <li
          key={item.title}
          className={`relative pl-${level * 4} cursor-pointer`}
        >
          {level > 0 && (
            <div className="absolute left-0 top-1/2 h-1 w-4 bg-gray-400"></div>
          )}
          <div
            className={`flex items-center justify-between p-2 rounded-md hover:bg-gray-200`}
            onClick={() => (hasSubmenu ? toggleExpand(item.title) : undefined)}
          >
            {/* Correctly render the Icon passed to the menu item */}
            {/* <item.Icon className="text-xl" /> */}
            <span>{item.title}</span>
            {hasSubmenu && (
              <span>{isExpanded ? "▲" : "▼"}</span>
            )}
          </div>
          {console.log(item)}
          {hasSubmenu && isExpanded && (
            <ul className="ml-4 mt-2 space-y-1">
              {item.submenu.map((submenuItem) =>
                renderMenu(submenuItem, level + 1)
              )}
            </ul>
            
          )}
        </li>
      );
    };
  
    return (
      <div className="w-full max-w-xs bg-gray-100 p-4 rounded-md shadow-md">
        <h1 className="text-xl font-semibold mb-4">Menu</h1>
        <ul className="space-y-2">
          {sideBarItems.map((item) => renderMenu(item, 0))}
        </ul>
      </div>
    );
  };
  

export default TreeView;
