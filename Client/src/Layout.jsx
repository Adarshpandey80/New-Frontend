import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../src/layout/Navbar";
import Footer from "../src/layout/Footer";

function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default Layout;
