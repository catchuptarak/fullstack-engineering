"use client";

import FilterBar from "@/components/shared/FilterBar";
import SearchEmployee from "@/components/shared/SearchEmployee";
import TreeView from "@/components/shared/TreeView";
import AddEditForm from "@/components/shared/add-menu/AddMenuitem";
import AddMenuItem from "@/components/shared/add-menu/AddMenuitem";
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
      <div className="flex items-center justify-between mb-4">
        {/* Listbox Section */}
        <div>
          <label htmlFor="listbox" className="block mb-2 text-sm font-medium text-gray-700">
            Menu
          </label>
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

          <TreeView></TreeView>
        </div>

        {/* Placeholder for additional components */}
        <h1 className="text-head">Menus</h1>
        <div className="p-6">
      <AddEditForm onSubmit={handleSubmit} />
      {/* Pass initialData if editing */}
      {/* <AddEditForm
        initialData={{
          menuId: "123",
          depth: 1,
          parentData: "Parent Menu",
          name: "Sample Name",
        }}
        onSubmit={handleSubmit}
      /> */}
    </div>
      </div>
    </section>
  );
};

export default Page;
