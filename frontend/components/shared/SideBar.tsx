"use client";

import sideBarItems from "@/constants/sideBarItems";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SideBar = () => {
  const pathname = usePathname();

  return (
    <div className="sticky left-0 top-0 z-20 h-screen lg:flex hidden">
      <div className="w-fit min-h-full bg-base-200 p-4 pt-20">
        {/* Sidebar content here */}
        <ul className="menu menu-lg gap-3">
          {sideBarItems.map((item, index) => {
            const isActive =
              (pathname.includes(item.route) && item.route.length > 1) ||
              pathname === item.route;

            return (
              <li key={index} className="group">
                <Link href={item.route} className={`${isActive && "active"}`}>
                  <item.Icon className="text-xl" />
                  {item.title}
                </Link>

                {/* Render Submenu */}
                {item.submenu && (
                  <ul className="ml-6 mt-2 hidden group-hover:block">
                    {item.submenu.map((subItem, subIndex) => (
                      <li key={subIndex}>
                        <Link
                          href={subItem.route}
                          className={`text-sm hover:text-primary ${
                            pathname === subItem.route ? "text-primary" : ""
                          }`}
                        >
                          {subItem.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default SideBar;
