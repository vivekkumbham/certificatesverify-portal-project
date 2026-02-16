import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaFileUpload, FaBell } from "react-icons/fa";
import logo from "../assets/cv logo.png";
export default function Sidebar() {
  return (
    <div
      className="
        flex flex-col
        w-full sm:w-64
        h-screen
        bg-gradient-to-r from-green-50 via-lime-100 to-yellow-50
        shadow-lg
        rounded-2xl sm:rounded-none
      "
    >
      {/* LOGO */}
      <div className="flex justify-center items-center   ">
        <img
         src={logo}
          alt="Student Panel"
          className="h-28 sm:h-32 md:h-36 object-contain"
        />
      </div>

      {/* NAVIGATION */}
      <nav className="mt-6 flex-1 space-y-2 px-4 text-gray-900 font-medium">
        <Link
          to="/dashboard"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-200 transition"
        >
          <FaHome /> Dashboard
        </Link>

        <Link
          to="/submit"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-200 transition"
        >
          <FaFileUpload /> Submit Documents
        </Link>
      </nav>
    </div>
  );
}
