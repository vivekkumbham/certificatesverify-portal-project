// src/components/Login.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import { motion } from "framer-motion";
import logo from "../assets/cv logo.png";


export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async (e) => {
    e.preventDefault();
    if (!email || !password) return alert("Enter email and password");
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:4000/api/auth/login",
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
      }

      setLoading(false);
      alert(res.data?.message || "Login successful");
      nav("/dashboard");
    } catch (err) {
      setLoading(false);
      console.error("Login failed:", err?.response || err);
      alert(err?.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="h-screen bg-blue-200 flex items-center justify-center relative">
      <div className="absolute w-96 h-96  bg-gradient-to-r  from-green-800 via-lime-500 to-yellow-800 rounded-full  opacity-20 -top-10 left-10" />
      <div className="absolute w-80 h-80  bg-gradient-to-r  from-green-800 via-lime-500 to-yellow-800 rounded-full  opacity-20 bottom-10 right-10" />
      <img
        src={logo} 
        alt="Logo"
        className="h-30 sm:h-25 object-contain"
      />
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-lg"
      >
        <div className="flex justify-center mb-4"></div>
        <h2 className="text-3xl font-semibold text-center  mb-6 ">
          Login
        </h2>
        <form onSubmit={login} className="space-y-5">
          <div className="relative">
            <FaUser className="absolute left-3 top-3 text-gray-900" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 bg-white/10 text-black rounded-lg outline-none border border-white/20"
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-gray-900" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 bg-white/10 text-black rounded-lg outline-none border border-white/20"
            />
          </div>

          <div className="flex items-center justify-between text-sm text-gray-900">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-pink-500" /> Remember me
            </label>
            <a href="/forgot-password" className="hover:text-pink-400">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3  bg-gradient-to-r from-green-100 via-lime-100 to-yellow-100 rounded-full italic"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-center text-gray-900 text-sm">
            Don't have an account?{" "}
            <a href="/register" className="text-teal-900 hover:text-black">
              Register
            </a>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
