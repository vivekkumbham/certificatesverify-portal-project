// src/page/DocumentForm.jsx
import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import StudentLayout from "../layouts/StudentLayout";

export default function DocumentForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    email: "",
    phone: "",
    address: "",
    sop: "",
    state: "",
    country: "",
    collegeName: "",
    group: "",
    whichGroup: "",
    registeredNumber: "",
    studentRoll: "",
    tenthRoll: "",
    interRoll: "",
    graduationRoll: "",
    passport: null,
    aadhaarFile: null,
    tenthCertificate: null,
    interCertificate: null,
    graduationCertificate: null,
    transferCertificate: null,
  });

  const [loading, setLoading] = useState(false);
  const [previews, setPreviews] = useState({});

  /* ========= VALIDATION HELPERS ========= */

  // Only alphabets + space, max 40 chars
  const handleAlpha = (e) => {
    const value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
    if (value.length <= 40) {
      setForm((s) => ({ ...s, [e.target.name]: value }));
    }
  };

  // Only numbers, max 20 digits
  const handleNumber = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 20) {
      setForm((s) => ({ ...s, [e.target.name]: value }));
    }
  };

  const update = (e) =>
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleFile = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const name = e.target.name;
    setForm((s) => ({ ...s, [name]: file }));

    if (file.type?.startsWith("image/")) {
      setPreviews((p) => ({ ...p, [name]: URL.createObjectURL(file) }));
    } else {
      setPreviews((p) => ({ ...p, [name]: file.name }));
    }
  };

  const checkPhoneExists = async (phone) => {
    try {
      const res = await axios.get(
        `http://localhost:4000/api/docs/check-phone/${phone}`
      );
      return res.data.exists; // true / false
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const submit = async () => {
    try {
      if (!form.phone || form.phone.length !== 10) {
        alert("Phone number is required and must be 10 digits");
        return;
      }

      if (!form.email) {
        alert("Email is required");
        return;
      }

      if (!form.firstName || !form.lastName) {
        alert("First Name and Last Name are required");
        return;
      }

      // 🔴 CHECK DUPLICATE PHONE
      const exists = await checkPhoneExists(form.phone);
      if (exists) {
        alert("This phone number is already used for document submission");
        return;
      }

      setLoading(true);

      const fd = new FormData();
      [
        "firstName",
        "lastName",
        "dob",
        "gender",
        "email",
        "phone",
        "address",
        "sop",
        "state",
        "country",
        "collegeName",
        "group",
        "whichGroup",
        "registeredNumber",
        "studentRoll",
        "tenthRoll",
        "interRoll",
        "graduationRoll",
      ].forEach((k) => fd.append(k, form[k] || ""));

      Object.keys(form).forEach((k) => {
        if (form[k] instanceof File) fd.append(k, form[k]);
      });

      const token = localStorage.getItem("token") || "";
      if (!token) {
        alert("You must be logged in.");
        setLoading(false);
        return;
      }

      const res = await axios.post(
        "http://localhost:4000/api/docs/submit",
        fd,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Submitted Successfully");

      window.location.href = "/dashboard";
    } catch (err) {
      console.error(err);
      alert("Submission Failed");
    } finally {
      setLoading(false);
    }
  };

  // SVG Upload icon (no dependency)
  const UploadIcon = () => (
    <svg
      width="40"
      height="40"
      fill="none"
      stroke="#9ca3af"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mx-auto mb-2"
    >
      <path d="M12 20h9a4 4 0 0 0 0-8h-1" />
      <path d="M12 12l3-3 3 3" />
      <path d="M15 9v9" />
    </svg>
  );

  return (
    <StudentLayout>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto p-10 rounded-2xl shadow-xl
             bg-gradient-to-br from-green-50 via-sky-50 to-white"
      >
        {/* ---------- STEP INDICATOR ---------- */}
        <div className="flex items-center justify-between mb-10">
          {["Registration Form", "Statement of Purpose", "Submit"].map(
            (label, index) => (
              <div key={index} className="flex items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold 
                ${index === 0 ? "bg-blue-600" : "bg-gray-300"}`}
                >
                  {index + 1}
                </div>

                <span
                  className={`ml-2 text-sm font-medium ${
                    index === 0 ? "text-blue-600" : "text-gray-400"
                  }`}
                >
                  {label}
                </span>

                {index < 2 && (
                  <div className="flex-1 h-px bg-gray-300 mx-2"></div>
                )}
              </div>
            )
          )}
        </div>

        <h2 className="text-3xl font-bold mb-8 text-gray-800 tracking-tight">
          Document Submission
        </h2>

        {/* ---------- PERSONAL DETAILS ---------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <input
            name="firstName"
            placeholder="First Name"
            required
            value={form.firstName}
            maxLength={40}
            onChange={(e) =>
              update({
                target: {
                  name: "firstName",
                  value: e.target.value.replace(/[^a-zA-Z\s]/g, ""),
                },
              })
            }
            className="p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            name="lastName"
            placeholder="Last Name"
            required
            value={form.lastName}
            maxLength={40}
            onChange={(e) =>
              update({
                target: {
                  name: "lastName",
                  value: e.target.value.replace(/[^a-zA-Z\s]/g, ""),
                },
              })
            }
            className="p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            name="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={update}
            className="p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            name="phone"
            placeholder="Phone Number"
            required
            value={form.phone}
            maxLength={20}
            inputMode="numeric"
            onChange={(e) =>
              update({
                target: {
                  name: "phone",
                  value: e.target.value.replace(/\D/g, ""),
                },
              })
            }
            className="p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            type="date"
            name="dob"
            required
            value={form.dob}
            max={new Date().toISOString().split("T")[0]}
            onChange={update}
            className="p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <select
            name="gender"
            value={form.gender}
            required
            onChange={update}
            className="p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="" required>
              Select Gender
            </option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>

          {/* ---------------- STATE ---------------- */}
          <input
            name="state"
            placeholder="State"
            value={form.state}
            required
            maxLength={40}
            onChange={(e) =>
              update({
                target: {
                  name: "state",
                  value: e.target.value.replace(/[^a-zA-Z\s]/g, ""),
                },
              })
            }
            className="p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          {/* ---------------- COUNTRY ---------------- */}
          <input
            name="country"
            placeholder="Country"
            required
            value={form.country}
            maxLength={40}
            onChange={(e) =>
              update({
                target: {
                  name: "country",
                  value: e.target.value.replace(/[^a-zA-Z\s]/g, ""),
                },
              })
            }
            className="p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          {/* ---------------- COLLEGE NAME ---------------- */}
          <input
            name="collegeName"
            placeholder="College Name"
            value={form.collegeName}
            required
            maxLength={40}
            onChange={(e) =>
              update({
                target: {
                  name: "collegeName",
                  value: e.target.value.replace(/[^a-zA-Z\s]/g, ""),
                },
              })
            }
            className="p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none md:col-span-2"
          />
          <input
            name="group"
            placeholder="Department"
            required
            value={form.group}
            maxLength={40}
            onChange={(e) =>
              update({
                target: {
                  name: "group",
                  value: e.target.value.replace(/[^a-zA-Z\s]/g, ""),
                },
              })
            }
            className="p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            name="registeredNumber"
            placeholder="Student roll number"
            required
            value={form.registeredNumber}
            maxLength={20}
            inputMode="numeric"
            onChange={(e) =>
              update({
                target: {
                  name: "registeredNumber",
                  value: e.target.value.replace(/\D/g, ""),
                },
              })
            }
            className="p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none md:col-span-2"
          />

          <textarea
            name="address"
            placeholder="Full Address"
            required
            value={form.address}
            onChange={update}
            className="p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none md:col-span-2"
          />

          <textarea
            name="sop"
            placeholder="Statement of Purpose"
            required
            value={form.sop}
            onChange={update}
            rows={4}
            className="p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none md:col-span-2"
          />
        </div>

        {/* ---------- DOCUMENT UPLOAD AREA ---------- */}
        <h3 className="text-xl font-semibold mb-4 text-gray-700">
          Upload Your Documents
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {[
            { label: "Passport / Photo", key: "passport" },
            { label: "Aadhaar File", key: "aadhaarFile" },
            { label: "10th Certificate", key: "tenthCertificate" },
            { label: "12th Certificate", key: "interCertificate" },
            { label: "Graduation Certificate", key: "graduationCertificate" },
            { label: "Transfer Certificate", key: "transferCertificate" },
          ].map((doc, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.01 }}
              className="p-6 border rounded-xl bg-gray-50 shadow-sm hover:shadow-lg transition cursor-pointer"
            >
              <label className="font-semibold text-gray-700 mb-3 block">
                {doc.label}
              </label>

              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition relative">
                <UploadIcon />
                <span className="text-sm text-gray-500">
                  Drag & Drop or Click to Upload
                </span>

                <input
                  type="file"
                  required
                  name={doc.key}
                  onChange={handleFile}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>

              {previews[doc.key] && (
                <img
                  src={previews[doc.key]}
                  className="mt-4 w-40 h-40 object-cover rounded-xl shadow-md border mx-auto"
                  alt=""
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* ---------- SUBMIT BUTTON ---------- */}
        <div className="flex justify-center mt-14">
          <button
            onClick={(e) => {
              const formEl = e.target.closest("form");
              if (formEl && !formEl.checkValidity()) {
                formEl.reportValidity(); // 🔥 activates missing fields
                return;
              }
              submit();
            }}
            disabled={loading}
            className="px-10 py-3 bg-blue-600 text-white rounded-xl text-lg font-semibold hover:bg-blue-700 transition shadow"
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </div>
      </motion.div>
    </StudentLayout>
  );
}
