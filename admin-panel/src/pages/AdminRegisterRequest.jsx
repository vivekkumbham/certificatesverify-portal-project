import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function AdminRegisterRequest() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    if (!name || !email || !password) {
      setMsg("All fields required");
      return;
    }
    try {
      await axios.post('http://localhost:4000/api/admin-auth/register', { name, email, password });
      setMsg("Request submitted. Wait for approval.");
      setTimeout(() => nav("/login"), 1200);
    } catch (err) {
      setMsg(err.response?.data?.error || "Request failed");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <form
        onSubmit={submit}
        className="w-96 bg-white p-8 rounded shadow space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center">
          Request Admin Access
        </h2>
        {msg && (
          <div className="p-2 bg-green-100 text-green-700 rounded">{msg}</div>
        )}
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border"
          placeholder="Full name"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border"
          placeholder="Email"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border"
          placeholder="Password"
          type="password"
        />
        <button className="w-full bg-purple-600 text-white p-3 rounded">
          Send Request
        </button>
        <p className="text-center text-sm">
          Already approved?{" "}
          <a href="/login" className="text-blue-600">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
