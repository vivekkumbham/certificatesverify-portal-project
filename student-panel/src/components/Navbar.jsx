import React, { useState } from "react";
import { FaBell, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const nav = useNavigate();

  const logout = () => {
    localStorage.removeItem("studentLogin");
    nav("/login");
  };

  return (
    <div className="w-full bg-white shadow-md rounded-lg px-6 py-10 flex justify-between items-center  bg-gradient-to-r from-yellow-50 via-lime-100 to-green-100  ">
      <h2 className="text-xl font-semibold">Welcome Student Documents</h2>

      <div className="flex items-center gap-6">
        {/* 🔔 Notification Bell
        <FaBell className="text-2xl cursor-pointer text-gray-600" />
*/}
        <div className="relative">
          <FaUserCircle
            className="text-3xl cursor-pointer text-gray-700"
            onClick={() => setOpen(!open)}
          />

          {open && (
            <div className="absolute right-0 mt-3 w-40 bg-white shadow-lg rounded-lg p-2 border">
              <p
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => nav("/profile")}
              >
                Profile
              </p>
              <p
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => nav("/change-password")}
              >
                Change Password
              </p>
              <p
                className="p-2 hover:bg-gray-100 cursor-pointer text-red-500"
                onClick={logout}
              >
                Logout
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
