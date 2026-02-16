import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IoNotificationsOutline } from "react-icons/io5";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0); // 🔔 notification count
  const nav = useNavigate();
  const token = localStorage.getItem("adminToken");

  // ✅ Load notification count
  // useEffect(() => {
  //   if (!token) return;
  //   const loadCount = async () => {
  //     try {
  //       const res = await axios.get(
  //         "http://localhost:4000/api/notifications/admin/count",
  //         {
  //           headers: { Authorization: `Bearer ${token}` },
  //         }
  //       );
  //       setCount(res.data.count || 0);
  //     } catch (err) {
  //       console.error("Notification count error:", err);
  //     }
  //   };

  //   loadCount();
  // }, []);

  const logout = () => {
    localStorage.removeItem("adminToken");
    nav("/login");
  };

  return (
    <header className="w-full bg-white shadow p-4 py-10 flex justify-between items-center bg-gradient-to-r from-yellow-50 via-lime-100 to-green-100 ">
      <div className="font-semibold text-lg">Welcome, Admin</div>

      <div className="flex items-center gap-6">
        {/* 🔔 Notification Bell
        <div
          className="relative cursor-pointer"
          onClick={() => nav("/notifications")}
        >
          <IoNotificationsOutline className="text-3xl text-gray-700" />

          {count > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {count}
            </span>
          )}
        </div> */}

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpen((o) => !o)}
            className="px-3 py-1 border rounded"
          >
            Profile
          </button>

          {open && (
            <div className="absolute right-0 mt-2 bg-white border rounded shadow w-40">
              <div className="p-2 hover:bg-gray-100 cursor-pointer">
                Profile
              </div>
              <div className="p-2 hover:bg-gray-100 cursor-pointer">
                Change Password
              </div>
              <div
                className="p-2 hover:bg-gray-100 cursor-pointer text-red-600"
                onClick={logout}
              >
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
