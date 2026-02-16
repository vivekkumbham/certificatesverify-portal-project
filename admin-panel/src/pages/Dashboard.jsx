import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [list, setList] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, verified: 0 });
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const nav = useNavigate();

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    if (!token) {
      nav("/login");
      return;
    }
    loadAll();
  }, []);

  //useEffect(() => {
  // fetch(`/api/notifications/ADMIN/${adminId}`)
  //   .then(res => res.json())
  //   .then(data => setNotifications(data));
  //}, []);

  const loadAll = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/admin/docs/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = res.data.list || [];
      console.log(data, "data...");

      setList(data);
      setStats({
        total: data.length,
        pending: data.filter((i) => i.status === "Pending").length,
        verified: data.filter((i) => i.status === "Verified").length,
      });
    } catch (e) {
      console.error(e);
      alert("Failed to load admin data. Make sure backend is running.");
    }
  };

  const filtered = list.filter((s) => {
    console.log(s, "s....");

    if (!q) return true;
    const name = (s.fields && s.fields.firstName) || "";
    const phone = (s.fields && s.fields.phone) || "";
    const email = (s.fields && s.fields.email) || "";
    const state = (s.fields && s.fields.state) || "";
    const country = (s.fields && s.fields.country) || "";
    const registeredNumber = (s.fields && s.fields.registeredNumber) || "";
    const group = (s.fields && s.fields.group) || "";
    const collegeName = (s.fields && s.fields.collegeName) || "";
    const gender = (s.fields && s.fields.gender) || "";
    const dob = (s.fields && s.fields.dob) || "";
    return (
      name.toLowerCase().includes(q.toLowerCase()) ||
      phone.includes(q.trim()) ||
      email ||
      dob ||
      state ||
      country ||
      registeredNumber ||
      group ||
      collegeName ||
      gender ||
      dob
    );
  });

  const openModal = (item) => {
    setSelected(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelected(null);
    setIsModalOpen(false);
  };

  const handleStatusChange = async (status) => {
    if (!selected) return;

    try {
      const fd = new FormData();
      fd.append("status", status);

      await axios.post(`/api/admin/docs/verify/${selected._id}`, fd, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await loadAll();
      closeModal();
    } catch (e) {
      console.error(e);
      alert("Failed to update status");
    }
  };

  const renderFilePreview = (file, idx, status) => {
    if (!file) return null;

    const fullUrl = `http://localhost:4000${file.url}`;
    const isImage = /\.(jpg|jpeg|png|webp|gif)$/i.test(file.filename);

    const url =
      typeof file === "string"
        ? file
        : fullUrl || file.path || file.location || "";

    const filename =
      (typeof file === "string" ? file.split("/").pop() : file.filename) ||
      `Document-${idx + 1}`;

    return (
      <div key={idx} className="border rounded-lg p-3 bg-gray-50 flex flex-col">
        <div className="relative rounded overflow-hidden">
          {isImage ? (
            <>
              <div className="overflow-hidden">
                <img
                  src={fullUrl}
                  alt={file.filename}
                  className="h-40 w-full object-cover hover:scale-110 transition"
                />
              </div>
              {/* VERIFIED / REJECTED STAMP */}
              {status !== "Pending" && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span
                    className={`px-4 py-2 rounded-full text-xl font-extrabold tracking-widest uppercase ${
                      status === "Verified"
                        ? "bg-green-600/80 text-white"
                        : "bg-red-600/80 text-white"
                    }`}
                  >
                    {status}
                  </span>
                </div>
              )}
            </>
          ) : (
            <div className="h-24 flex items-center justify-center bg-gray-100">
              <span className="text-sm text-gray-600 break-all">
                {filename}
              </span>
            </div>
          )}
        </div>

        {fullUrl && (
          <a
            href={fullUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-2 text-sm text-blue-600 underline"
          >
            Download
          </a>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen  bg-gradient-to-br from-orange-50 via-yellow-100 to-blue-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="p-6 overflow-y-auto">
          {/* HEADER */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">Admin Dashboard</h1>

            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Search by name or phone"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="px-3 py-2 border rounded-lg shadow-sm"
              />
              <button
                onClick={loadAll}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Refresh
              </button>
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-white rounded shadow">
              <div className="text-sm text-gray-500">Total</div>
              <div className="text-2xl font-bold">{stats.total}</div>
            </div>
            <div className="p-4 bg-white rounded shadow">
              <div className="text-sm text-gray-500">Pending</div>
              <div className="text-2xl font-bold text-yellow-600">
                {stats.pending}
              </div>
            </div>
            <div className="p-4 bg-white rounded shadow">
              <div className="text-sm text-gray-500">Verified</div>
              <div className="text-2xl font-bold text-green-600">
                {stats.verified}
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="bg-white rounded shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    View More
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map((item) => (
                  <tr key={item._id}>
                    <td className="px-6 py-4">
                      {item.fields?.firstName || "—"}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-500">
                      {item.fields?.phone || "—"}
                    </td>

                    <td className="px-6 py-4">
                      {item.status === "Verified" ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                          Verified
                        </span>
                      ) : item.status === "Pending" ? (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                          Pending
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded">
                          Rejected
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-500">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleString()
                        : "—"}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openModal(item)}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        View More
                      </button>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-6 text-gray-500">
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* MODAL */}
      {isModalOpen && selected && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold mb-2">
              {selected.fields?.firstName || "Student"} – Details
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3 text-sm text-gray-600">
              <div>
                <span className="font-semibold">Phone:</span>{" "}
                <span>{selected.fields?.phone || "—"}</span>
              </div>

              <div>
                <span className="font-semibold">Email:</span>{" "}
                <span>{selected.fields?.email || "—"}</span>
              </div>

              <div>
                <span className="font-semibold">DOB:</span>{" "}
                <span>{selected.fields?.dob || "—"}</span>
              </div>

              <div>
                <span className="font-semibold">Gender:</span>{" "}
                <span>{selected.fields?.gender || "—"}</span>
              </div>

              <div>
                <span className="font-semibold">State:</span>{" "}
                <span>{selected.fields?.state || "—"}</span>
              </div>

              <div>
                <span className="font-semibold">Country:</span>{" "}
                <span>{selected.fields?.country || "—"}</span>
              </div>

              <div>
                <span className="font-semibold">College Name:</span>{" "}
                <span>{selected.fields?.collegeName || "—"}</span>
              </div>

              <div>
                <span className="font-semibold">Group:</span>{" "}
                <span>{selected.fields?.group || "—"}</span>
              </div>

              <div>
                <span className="font-semibold">Registered No:</span>{" "}
                <span>{selected.fields?.registeredNumber || "—"}</span>
              </div>

              <div className="col-span-2 md:col-span-3">
                <span className="font-semibold">Status:</span>{" "}
                {selected.status === "Verified" ? (
                  <span className="text-green-600 font-semibold">Verified</span>
                ) : selected.status === "Pending" ? (
                  <span className="text-yellow-600 font-semibold">Pending</span>
                ) : (
                  <span className="text-red-600 font-semibold">Rejected</span>
                )}
              </div>
            </div>

            {/* DOCUMENTS SECTION */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">
                Student Submitted Documents
              </h3>

              {selected.requiredFiles &&
              Object.keys(selected.requiredFiles).length > 0 ? (
                Object.entries(selected.requiredFiles).map(([key, value]) => (
                  <div key={key} className="mb-4">
                    <h4 className="font-semibold mb-2 capitalize">
                      {key.replace(/([A-Z])/g, " $1")}
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Array.isArray(value)
                        ? value.map((file, idx) =>
                            renderFilePreview(
                              file,
                              idx,
                              selected.status || "Pending"
                            )
                          )
                        : renderFilePreview(
                            value,
                            0,
                            selected.status || "Pending"
                          )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">
                  No student documents found.
                </p>
              )}
            </div>

            {/* BUTTONS */}
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => handleStatusChange("Rejected")}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Reject
              </button>

              <button
                onClick={() => handleStatusChange("Verified")}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
