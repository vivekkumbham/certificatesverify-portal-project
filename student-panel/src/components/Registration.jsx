// src/components/Registration.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Registration() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    dob: "",
    email: "",
    gender: "",
    college: "",
    state: "",
    roll: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.phone || !form.password) {
      alert("Please fill required fields.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const payload = { ...form };
      delete payload.confirmPassword;

      const res = await axios.post(
        "http://localhost:4000/api/auth/register",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      alert(res.data?.message || "Registered successfully");
      nav("/login");
    } catch (err) {
      alert(err?.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-300 via-blue-200 to-blue-300 px-4 py-8">
      {/* Decorative Blobs */}
      <div className="hidden md:block absolute w-96 h-96 bg-gradient-to-r from-green-100 via-lime-100 to-yellow-100 rounded-full opacity-20 -top-10 left-10" />
      <div className="hidden md:block absolute w-80 h-80 bg-gradient-to-r from-green-100 via-lime-100 to-yellow-100 rounded-full opacity-20 bottom-10 right-10" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl bg-white/20 backdrop-blur-xl p-6 sm:p-8 rounded-2xl border border-white/30 shadow-xl"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-black mb-6">
          Student Registration
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            required
            className="input"
          />

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            required
            className="input"
          />

          <input
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
            required
            className="input"
          />

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email Address"
            required
            className="input"
          />

          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            required
            className="input"
          >
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>

          <input
            name="college"
            value={form.college}
            onChange={handleChange}
            placeholder="College Name"
            className="input"
          />

          <input
            name="state"
            value={form.state}
            onChange={handleChange}
            placeholder="State"
            className="input"
          />

          <input
            name="roll"
            value={form.roll}
            onChange={handleChange}
            placeholder="Roll Number"
            className="input"
          />

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="input"
          />

          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            required
            className="input"
          />

          <button
            type="submit"
            disabled={loading}
            className="md:col-span-2 mt-3 py-3 bg-white text-blue-700 rounded-xl font-semibold hover:bg-gray-100 transition w-full"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <p className="md:col-span-2 text-center text-gray-600 text-sm">
            Back to{" "}
            <a href="/login" className="text-blue-700 font-semibold">
              Login
            </a>
          </p>
        </form>
      </motion.div>

      {/* Tailwind reusable input style */}
      <style>
        {`
          .input {
            padding: 0.75rem;
            border-radius: 0.75rem;
            background: rgba(255,255,255,0.8);
            border: 1px solid rgba(255,255,255,0.4);
            color: black;
            width: 100%;
          }
          .input:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 2px rgba(59,130,246,0.3);
          }
        `}
      </style>
    </div>
  );
}
