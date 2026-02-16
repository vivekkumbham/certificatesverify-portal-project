import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import StudentLayout from "../layouts/StudentLayout";

export default function StudentEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ---------- LOAD SUBMISSION ---------- */
  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(
          `http://localhost:4000/api/docs/submission/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // 🔴 BLOCK VERIFIED EDIT
        if (res.data.sub.status === "Verified") {
          alert("Verified submissions cannot be edited");
          navigate("/dashboard");
          return;
        }

        setForm(res.data.sub.fields);
      } catch (err) {
        console.error(err);
        navigate("/dashboard");
      }
    };

    load();
  }, [id, navigate]);

  const update = (e) =>
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const submit = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:4000/api/docs/update/${id}`,
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Updated Successfully");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!form) return <p className="text-center mt-10">Loading...</p>;

  return (
    <StudentLayout>
      <div className="max-w-5xl mx-auto p-10 rounded-2xl shadow-xl bg-white">
        <h2 className="text-3xl font-bold mb-8">Edit Submission</h2>

        {/* 🔁 SAME INPUT FIELDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input name="firstName" value={form.firstName} onChange={update} className="p-3 border rounded-xl" />
          <input name="lastName" value={form.lastName} onChange={update} className="p-3 border rounded-xl" />
          <input name="email" value={form.email} onChange={update} className="p-3 border rounded-xl" />
          <input name="phone" value={form.phone} disabled className="p-3 border rounded-xl bg-gray-100" />
          <textarea name="address" value={form.address} onChange={update} className="p-3 border rounded-xl md:col-span-2" />
          <textarea name="sop" value={form.sop} onChange={update} className="p-3 border rounded-xl md:col-span-2" />
        </div>

        <div className="text-center mt-10">
          <button
            onClick={submit}
            disabled={loading}
            className="px-10 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700"
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </StudentLayout>
  );
}
