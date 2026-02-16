import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../assets/cv logo.png";

export default function AdminLogin() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    if (!email || !password) {
      setMsg("Email and password required");
      return;
    }
    try {
      const res = await axios.post(
        "http://localhost:4000/api/admin-auth/login",
        {
          email,
          password,
        }
      );
      localStorage.setItem("adminToken", res.data.token);
      if (res.data.admin?.role === "superadmin") {
        nav("/superadmin-dashboard");
      } else {
        nav("/dashboard");
      }
    } catch (err) {
      setMsg(err.response?.data?.error || "Login failed");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-200">
      <div className="absolute w-96 h-96  bg-gradient-to-r from-green-800 via-lime-500 to-yellow-800 rounded-full  opacity-20 -top-10 left-10" />
      <div className="absolute w-80 h-80  bg-gradient-to-r from-green-800 via-lime-500 to-yellow-800 rounded-full  opacity-20 bottom-10 right-10" />
       <img
      src={logo} 
        alt="Logo"
        className="h-30 sm:h-25 object-contain"
      />
      <form
        onSubmit={submit}
        className="w-96   p-10 rounded-2xl shadow space-y-4 backdrop-blur-xl bg-white/10 border border-white/20"
      >
        <h2 className="text-2xl font-semibold text-center ">Admin Login</h2>
        {msg && (
          <div className="p-2 bg-red-100 text-red-700 rounded">{msg}</div>
        )}
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border"
          placeholder="Email"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className="w-full p-3 border"
          placeholder="Password"
        />
        <button className="w-full bg-blue-600 text-white p-3 rounded">
          Login
        </button>
        <p className="text-center text-sm text-white">
          No account?{" "}
          <a href="/admin-register" className="text-blue-600">
            Request Access
          </a>
        </p>
      </form>
    </div>
  );
}
