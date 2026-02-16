import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import axios from "axios";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function GraphsDashboard() {
  const [yearData, setYearData] = useState([]);
  const [verifiedData, setVerifiedData] = useState([]);
  const [rejectedData, setRejectedData] = useState([]);

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    loadGraphData();
  }, []);

  const loadGraphData = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/admin/graph-stats', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setYearData(res.data.yearlySubmissions || []);
      setVerifiedData(res.data.yearlyVerified || []);
      setRejectedData(res.data.yearlyRejected || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load analytics");
    }
  };

  return (
    <div className="flex h-screen bg-[#0b0f1a] text-white">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="p-6 overflow-y-auto">

          <h1 className="text-3xl font-bold text-center mb-6 tracking-wide text-cyan-300">
            Analytics Dashboard
          </h1>

          {/* MAIN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* ======================= ACTIVITY CHART ======================= */}
            <div className="col-span-2 bg-[#111827] rounded-2xl p-6 shadow-xl border border-white/10 backdrop-blur-xl">
              <h2 className="text-xl font-semibold mb-4 text-blue-300">
                Yearly Document Submissions
              </h2>

              <div className="w-full h-72">
                <ResponsiveContainer>
                  <AreaChart data={yearData}>
                    <defs>
                      <linearGradient id="colorMain" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.9}/>
                        <stop offset="95%" stopColor="#ec4899" stopOpacity={0.3}/>
                      </linearGradient>
                    </defs>

                    <XAxis dataKey="year" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <Tooltip />

                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#38bdf8"
                      fill="url(#colorMain)"
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ======================= VERIFIED CHART ======================= */}
            <div className="bg-[#111827] rounded-2xl p-6 shadow-xl border border-white/10">
              <h2 className="text-xl font-semibold mb-4 text-green-300">
                Yearly Verified Students
              </h2>

              <div className="w-full h-72">
                <ResponsiveContainer>
                  <LineChart data={verifiedData}>
                    <XAxis dataKey="year" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <Tooltip />

                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#4ade80"
                      strokeWidth={3}
                      dot={{ fill: "#4ade80" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ======================= REJECTED CHART ======================= */}
            <div className="bg-[#111827] rounded-2xl p-6 shadow-xl border border-white/10">
              <h2 className="text-xl font-semibold mb-4 text-red-300">
                Yearly Rejected Students
              </h2>

              <div className="w-full h-72">
                <ResponsiveContainer>
                  <BarChart data={rejectedData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="year" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip />

                    <Bar
                      dataKey="count"
                      fill="#f87171"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
