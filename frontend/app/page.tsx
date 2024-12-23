"use client";
import { useEffect, useState } from 'react';

export default function Home() {
  const [menusData, setMenusData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Recursive function to calculate total depth, average depth and deepest level
  const calculateDepths = (menus) => {
    let totalDepth = 0;
    let totalCount = 0;
    let deepestLevel = 0;

    const calculate = (menu) => {
      totalDepth += menu.depth;
      totalCount++;

      // Update the deepest level if the current menu's depth is deeper
      if (menu.depth > deepestLevel) {
        deepestLevel = menu.depth;
      }

      // Recursively calculate depth for children
      if (menu.children && menu.children.length > 0) {
        menu.children.forEach(calculate);
      }
    };

    menus.forEach(calculate);

    return {
      totalDepth,
      totalCount,
      deepestLevel,
    };
  };

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        console.log("API Base URL:", apiBaseUrl);

        const response = await fetch(`${apiBaseUrl}/menu/all`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("Response Status:", response.status);

        if (!response.ok) {
          throw new Error("Failed to fetch menu data");
        }

        const data = await response.json();
        setMenusData(data);
      } catch (err) {
        console.error("Error fetching menus:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, [apiBaseUrl]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Calculate total depth, average depth, and deepest level
  const { totalDepth, totalCount, deepestLevel } = calculateDepths(menusData);

  // Calculate the average depth
  const avgDepth = totalCount > 0 ? Math.trunc(totalDepth / totalCount) : 0;

  return (
    <section>
      <h1 className="text-head">Menu Insights</h1>
      <div className="join join-vertical lg:join-horizontal shadow-md w-full">
        <div className="join-item p-10">
          <p className="text-6xl max-sm:text-4xl font-black text-secondary text-center">
            {totalCount}
          </p>
          <p className="text-center opacity-80">Total Menus</p>
        </div>
        <div className="join-item p-10">
          <p className="text-6xl max-sm:text-4xl font-black text-accent text-center">
            {avgDepth}
          </p>
          <p className="text-center opacity-80">Average Depth</p>
        </div>
        <div className="join-item p-10">
          <p className="text-6xl max-sm:text-4xl font-black text-secondary text-center">
            {deepestLevel}
          </p>
          <p className="text-center opacity-80">Deepest Level</p>
        </div>
      </div>
    </section>
  );
}
