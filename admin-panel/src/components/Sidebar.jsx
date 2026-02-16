import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import logo from "../assets/cv logo.png";

export default function Sidebar() {
  const nav = useNavigate();
  const [open, setOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("adminToken");
    nav("/login");
  };

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="sm:hidden flex items-center justify-between p-4 bg-gray-800 text-white">
        <button onClick={() => setOpen(true)}>
          <FaBars size={22} />
        </button>
        <span className="font-semibold">Admin Panel</span>
      </div>

      {/* MOBILE OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 sm:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed sm:static top-0 left-0 z-50
          h-screen w-64
          bg-gradient-to-b from-green-50 via-lime-100 to-yellow-50
          shadow-xl
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full sm:translate-x-0"}
        `}
      >
        {/* CLOSE BUTTON (MOBILE) */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 sm:hidden text-gray-700"
        >
          <FaTimes size={20} />
        </button>

        {/* LOGO */}
        <div className="flex justify-center items-center  ">
          <img
            src={logo} 
            alt="Admin Panel"
            className="h-30 sm:h-30 md:h-35 object-contain"
          />
        </div>

        {/* NAVIGATION */}
        <nav className="mt-6 px-4 space-y-2 text-gray-900 font-medium">
          <Link
            to="/dashboard"
            onClick={() => setOpen(false)}
            className="block py-2 px-3 rounded-lg hover:bg-blue-200 transition"
          >
            Dashboard
          </Link>

          <Link
            to="/history"
            onClick={() => setOpen(false)}
            className="block py-2 px-3 rounded-lg hover:bg-blue-200 transition"
          >
            History
          </Link>

          <Link
            to="/graphs"
            onClick={() => setOpen(false)}
            className="block py-2 px-3 rounded-lg hover:bg-blue-200 transition"
          >
            Analytics / Graphs
          </Link>

          <button
            onClick={logout}
            className="w-full text-left py-2 px-3 rounded-lg hover:bg-red-200 transition mt-6 text-red-700 font-semibold"
          >
            Logout
          </button>
        </nav>
      </aside>
    </>
  );
}
