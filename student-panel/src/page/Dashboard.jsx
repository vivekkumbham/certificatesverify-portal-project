import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import StudentLayout from "../layouts/StudentLayout";
import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [subs, setSubs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(
          "http://localhost:4000/api/docs/my-submissions",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setSubs(res.data.subs || []);
      } catch (err) {
        console.error("Failed to load submissions", err);
      }
    };

    load();
  }, []);

  return (
    <StudentLayout>
      {/* ================= STATUS COUNTS ONLY ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatusCard
          title="Pending"
          count={subs.filter((s) => s.status === "Pending").length}
          type="pending"
        />
        <StatusCard
          title="Verified"
          count={subs.filter((s) => s.status === "Verified").length}
          type="verified"
        />
        <StatusCard
          title="Rejected"
          count={subs.filter((s) => s.status === "Rejected").length}
          type="rejected"
        />
      </div>

      {/* ================= SUBMISSION LIST ================= */}
      <div className="space-y-4 sm:space-y-6">
        {subs.map((s) => (
          <div
            key={s._id}
            className="bg-white border border-sky-100 rounded-xl shadow p-4 sm:p-6"
          >
            {/* TOP: NAME + PHONE + STATUS */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
              <div>
                <p className="flex items-center gap-3 text-lg sm:text-2xl font-semibold text-gray-800">
                  <FaUserCircle className="text-2xl sm:text-3xl text-gray-700" />
                  {s.fields?.firstName || "Student"}
                </p>

                <p className="text-sm sm:text-lg text-gray-500 mt-1">
                  📞 {s.fields?.phone || "—"}
                </p>
              </div>

              <div className="self-start sm:self-auto">
                <StatusBadge status={s.status} />
              </div>
            </div>

            {/* SUBMISSION INFO */}
            <div className="text-sm sm:text-lg text-gray-600 mb-4">
              <span className="font-semibold">Submitted on:</span>{" "}
              {new Date(s.createdAt).toLocaleString()}
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
              <Link
                to={`/StudentEdit/${s._id}`}
                className="w-full sm:w-auto text-center px-6 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition"
              >
                Edit Details
              </Link>

              <Link
                to={`/StudentUpdate`}
                className="w-full sm:w-auto text-center px-6 py-2 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 transition"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      {subs.length === 0 && (
        <p className="text-center text-gray-600 mt-10">No submissions found.</p>
      )}
    </StudentLayout>
  );
}

/* ================= COMPONENTS ================= */

const StatusCard = ({ title, count, type }) => {
  const styles = {
    pending: "bg-yellow-50 border-yellow-200 text-yellow-700  ",
    verified: "bg-green-50 border-green-200 text-green-700",
    rejected: "bg-red-50 border-red-200 text-red-700",
  };

  return (
    <div className={`p-6 border rounded-xl shadow ${styles[type]}`}>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-3xl font-bold">{count}</p>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const styles = {
    Pending: "bg-yellow-100 text-yellow-700  ",
    Verified: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-4 py-1 rounded-full text-lg font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
};
