"use client";

import FilterBar from "@/components/shared/FilterBar";
import SearchEmployee from "@/components/shared/SearchEmployee";
import TreeView from "@/components/shared/TreeView";
import AddEditForm from "@/components/shared/add-menu/AddEditNode";
import EmployeeTable from "@/components/tables/EmployeeTable";
import { fetchEmployees } from "@/lib/actions/employee.actions";
import { useState } from "react";

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

const Page = async ({}: {}) => {
  const options = ["System Management"];
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  // Handlers for expand and collapse actions
  const handleExpandAll = () => {
    console.log("Expand All triggered");
    // Logic to expand all nodes in the TreeView
    // Pass a prop or call a method from TreeView to handle this
  };

  const handleCollapseAll = () => {
    console.log("Collapse All triggered");
    // Logic to collapse all nodes in the TreeView
    // Pass a prop or call a method from TreeView to handle this
  };

  const handleSubmit = (data: {
    menuId: string;
    depth: number;
    parentData: string;
    name: string;
  }) => {
    console.log("Form Submitted:", data);
    // Handle the submitted data (e.g., send it to an API or update state)
  };

  return (
    <section>
      <h1 className="text-head">Menu</h1>
      <div className="flex items-center justify-between mb-4">
        {/* Listbox Section */}
        <div>
          <select
            id="listbox"
            className="w-48 p-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          >
            {options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>

          {/* Expand/Collapse Buttons */}
          <div className="flex space-x-4 mt-4">
            <button
              onClick={handleExpandAll}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Expand All
            </button>
            <button
              onClick={handleCollapseAll}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Collapse All
            </button>
          </div>

          <div className="mt-6 mb-10">
            <TreeView onExpandAll={handleExpandAll} onCollapseAll={handleCollapseAll} />
          </div>
        </div>

        {/* Placeholder for additional components */}
        <div className="p-6"></div>
      </div>
    </section>
  );
};

export default Page;
