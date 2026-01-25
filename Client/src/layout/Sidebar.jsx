import React, { useState } from "react";
import { HomeIcon, ChartBarIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

function Sidebar() {
  const [open, setOpen] = useState(true);

  return (
    <div
      className={`bg-gray-900 text-white transition-all duration-300 ${
        open ? "w-64" : "w-16"
      } h-screen flex flex-col`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <span className={`${open ? "block" : "hidden"} font-bold text-lg`}>
          Dashboard
        </span>
        <button onClick={() => setOpen(!open)}>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            ></path>
          </svg>
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <Link
          to="/"
          className="flex items-center p-2 rounded hover:bg-gray-700 transition"
        >
          <HomeIcon className="w-6 h-6" />
          <span className={`${open ? "ml-3" : "hidden"}`}>Home</span>
        </Link>
        <Link
          to="/charts"
          className="flex items-center p-2 rounded hover:bg-gray-700 transition"
        >
          <ChartBarIcon className="w-6 h-6" />
          <span className={`${open ? "ml-3" : "hidden"}`}>Charts</span>
        </Link>
        <Link
          to="/settings"
          className="flex items-center p-2 rounded hover:bg-gray-700 transition"
        >
          <Cog6ToothIcon className="w-6 h-6" />
          <span className={`${open ? "ml-3" : "hidden"}`}>Settings</span>
        </Link>
      </nav>
    </div>
  );
}

export default Sidebar;
