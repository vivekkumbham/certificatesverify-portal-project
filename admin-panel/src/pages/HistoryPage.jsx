import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function HistoryPage() {
  const [records, setRecords] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [filterType, setFilterType] = useState("total"); // total | verified | rejected | pending
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/admin/history', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecords(res.data.records || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load history");
    }
  };

  // Extract available years for dropdown
  const yearsList = [...new Set(records.map((r) => new Date(r.createdAt).getFullYear()))]
    .sort((a, b) => b - a);

  // Filter by selected year
  const yearFiltered = selectedYear
    ? records.filter(
        (rec) => new Date(rec.createdAt).getFullYear() === Number(selectedYear)
      )
    : records;

  // Filter by status type
  const filteredRecords = yearFiltered.filter((r) => {
    if (filterType === "verified") return r.status === "Verified";
    if (filterType === "rejected") return r.status === "Rejected";
    if (filterType === "pending") return r.status === "Pending";
    return true; // total
  });

  // Stats for chosen year
  const stats = {
    total: yearFiltered.length,
    verified: yearFiltered.filter((r) => r.status === "Verified").length,
    rejected: yearFiltered.filter((r) => r.status === "Rejected").length,
    pending: yearFiltered.filter((r) => r.status === "Pending").length,
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6">History</h1>

          {/* Year Dropdown */}
          <div className="mb-6">
            <select
              className="p-3 border rounded w-60 bg-white shadow"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="">Select Year</option>
              {yearsList.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>

          {/* Stats Boxes */}
          <div className="grid grid-cols-4 gap-6 mb-10">
            <div
              onClick={() => setFilterType("total")}
              className={`cursor-pointer p-6 rounded shadow text-center ${
                filterType === "total" ? "bg-blue-300" : "bg-blue-100"
              }`}
            >
              <h2 className="text-2xl font-bold">{stats.total}</h2>
              <p>Total Submissions</p>
            </div>

            <div
              onClick={() => setFilterType("verified")}
              className={`cursor-pointer p-6 rounded shadow text-center ${
                filterType === "verified" ? "bg-green-300" : "bg-green-100"
              }`}
            >
              <h2 className="text-2xl font-bold">{stats.verified}</h2>
              <p>Verified</p>
            </div>

            <div
              onClick={() => setFilterType("rejected")}
              className={`cursor-pointer p-6 rounded shadow text-center ${
                filterType === "rejected" ? "bg-red-300" : "bg-red-100"
              }`}
            >
              <h2 className="text-2xl font-bold">{stats.rejected}</h2>
              <p>Rejected</p>
            </div>

            <div
              onClick={() => setFilterType("pending")}
              className={`cursor-pointer p-6 rounded shadow text-center ${
                filterType === "pending" ? "bg-yellow-300" : "bg-yellow-100"
              }`}
            >
              <h2 className="text-2xl font-bold">{stats.pending}</h2>
              <p>Pending</p>
            </div>
          </div>

          {/* Table */}
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-3 border">Student</th>
                <th className="p-3 border">Phone</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Submitted On</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((rec) => (
                <tr key={rec._id} className="border-b">
                  <td className="p-3">{rec.fields.fullName}</td>
                  <td className="p-3">{rec.student?.phone}</td>
                  <td className="p-3">{rec.status}</td>
                  <td className="p-3">
                    {new Date(rec.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredRecords.length === 0 && (
            <p className="text-gray-500 mt-4">No records found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
