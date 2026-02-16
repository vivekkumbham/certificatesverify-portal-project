import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../assets/cv logo.png";

export default function SuperAdminDashboard() {
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);

  const nav = useNavigate();

  const token = localStorage.getItem("adminToken");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const p = await axios.get(
        "http://localhost:4000/api/admin-manage/pending",
        { headers }
      );
      const a = await axios.get("http://localhost:4000/api/admin-manage/all", {
        headers,
      });

      setPending(p.data.pending || []);
      setApproved(a.data.approved || []);
    } catch (err) {
      console.error(err);
      nav("/login");
    }
  };

  const approve = async (id) => {
    await axios.post(`/api/admin-manage/approve/${id}`, {}, { headers });
    load();
  };

  const reject = async (id) => {
    await axios.post(`/api/admin-manage/reject/${id}`, {}, { headers });
    load();
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    nav("/login");
  };

  return (
  <div className="relative min-h-screen p-4 sm:p-6 bg-gradient-to-br from-black via-indigo-900 to-purple-900 overflow-hidden">
    {/* Decorative Blobs */}
    <div className="absolute w-96 h-96 bg-gradient-to-r from-green-200 via-lime-200 to-yellow-200 rounded-full opacity-20 -top-20 -left-20 blur-3xl" />
    <div className="absolute w-80 h-80 bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 rounded-full opacity-20 bottom-0 right-0 blur-3xl" />

    {/* ===== HEADER ===== */}
    <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 px-6 py-4 rounded-2xl bg-white/40 backdrop-blur-xl border border-white/20 shadow-xl">
      {/* Logo */}
      <img
       src={logo} 
        alt="Logo"
        className="h-28 sm:h-32 object-contain drop-shadow-lg"
      />

      <h1 className="text-2xl sm:text-3xl font-semibold italic text-white tracking-wide">
        SuperAdmin Dashboard
      </h1>

      <button
        onClick={logout}
        className="px-6 py-2 rounded-full bg-gradient-to-r from-red-500 to-pink-600 text-white font-medium hover:scale-105 transition"
      >
        Logout
      </button>
    </div>

    {/* ===== STATS ===== */}
    <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
      {[
        { label: "Pending Requests", value: pending.length, color: "text-yellow-400" },
        { label: "Approved Admins", value: approved.length, color: "text-green-400" },
        { label: "SuperAdmin", value: 1, color: "text-purple-400" },
      ].map((item, i) => (
        <div
          key={i}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 text-center shadow-lg hover:scale-105 transition"
        >
          <h2 className={`text-4xl font-bold ${item.color}`}>{item.value}</h2>
          <p className="text-gray-200 mt-2">{item.label}</p>
        </div>
      ))}
    </div>

    {/* ===== PENDING ADMINS ===== */}
    <div className="relative z-10 mt-12">
      <h2 className="text-2xl font-semibold text-white mb-4">
        Pending Admin Requests
      </h2>

      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4 shadow-lg">
        {pending.length === 0 ? (
          <p className="text-gray-300 text-center py-6">
            No pending requests.
          </p>
        ) : (
          pending.map((a) => (
            <div
              key={a._id}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 border-b border-white/10 hover:bg-white/5 transition"
            >
              <div>
                <p className="text-white font-semibold">{a.name}</p>
                <p className="text-gray-300 text-sm">{a.email}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => approve(a._id)}
                  className="px-4 py-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition"
                >
                  Approve
                </button>
                <button
                  onClick={() => reject(a._id)}
                  className="px-4 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>

    {/* ===== APPROVED ADMINS ===== */}
    <div className="relative z-10 mt-12">
      <h2 className="text-2xl font-semibold text-white mb-4">
        Approved Admins
      </h2>

      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4 shadow-lg">
        {approved.length === 0 ? (
          <p className="text-gray-300 text-center py-6">
            No approved admins.
          </p>
        ) : (
          approved.map((a) => (
            <div
              key={a._id}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 border-b border-white/10 hover:bg-white/5 transition"
            >
              <div>
                <p className="text-white font-semibold">{a.name}</p>
                <p className="text-gray-300 text-sm">{a.email}</p>
              </div>

              <span className="text-green-400 font-semibold">
                Approved ✓
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  </div>
);

}
