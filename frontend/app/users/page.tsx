"use client";

import React from 'react';
import { useRouter } from 'next/navigation'; // Import from next/navigation instead of next/router

const Page = () => {
  const router = useRouter(); // Use the useRouter hook from next/navigation

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-800">
      <h1 className="text-4xl font-bold text-center mb-6">Users & Group</h1>
      <p className="text-lg mb-8 text-center">
        Click the button below to configure your menus and manage settings.
      </p>
      <button
        onClick={() => router.push('systems/menus')}
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
      >
        Go to Menu Configurations
      </button>
    </div>
  );
};

export default Page;
