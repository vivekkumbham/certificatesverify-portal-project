import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Notifications() {
  const [logs, setLogs] = useState([]);
  const nav = useNavigate();
  const token = localStorage.getItem("adminToken");

  // useEffect(() => {
  //   loadNotifications();
  // }, []);

  const loadNotifications = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/api/notifications/admin",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLogs(res.data.logs || []);
    } catch (err) {
      console.log("Failed to load");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="p-6 overflow-y-auto">
          <h1 className="text-2xl font-semibold mb-6">Notifications</h1>

          <div className="bg-white rounded shadow p-4">
            {logs.length === 0 ? (
              <p className="text-gray-500">No notifications.</p>
            ) : (
              <ul>
                {logs.map((item) => (
                  <li
                    key={item._id}
                    className="p-3 border-b hover:bg-gray-100 cursor-pointer"
                    onClick={() => nav(`/submission/${item.submissionId}`)}
                  >
                    <strong>
                      {item.student?.firstName} {item.student?.lastName}
                    </strong>
                    submitted documents
                    <span className="text-gray-500 text-sm ml-2">
                      ({new Date(item.createdAt).toLocaleString()})
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
