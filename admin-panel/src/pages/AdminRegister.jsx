import React, { useState } from "react";
import axios from "axios";

export default function AdminRegisterRequest() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const sendRequest = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:4000/api/admin-auth/register', {
        name,
        email,
        password,
      });

      setMsg("Request sent to SuperAdmin. Wait for approval.");
    } catch (err) {
      setMsg(err.response?.data?.error || "Request failed");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-800">
     <div className="absolute w-96 h-96  bg-gradient-to-r from-green-200 via-lime-200 to-yellow-200 rounded-full  opacity-20 -top-10 left-10" />
      <div className="absolute w-80 h-80  bg-gradient-to-r from-green-300 via-lime-100 to-yellow-300 rounded-full  opacity-20 bottom-10 right-10" />
       <img
        src="/cv logo.png"
        alt="Logo"
        className="h-30 sm:h-25 object-contain"
      />
      <form
        onSubmit={sendRequest}
        className="w-96 bg-white p-8 rounded-xl shadow-xl space-y-5  backdrop-blur-xl bg-white/10 border border-white/20"
      >
        <h1 className="text-2xl font-bold text-center  text-white">Admin Access Request</h1>

        {msg && (
          <div className="p-2 bg-green-100 text-green-700 rounded">{msg}</div>
        )}

        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-3 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="w-full bg-blue-600 text-white p-3 rounded hover:bg-gradient-to-r from-green-300 via-lime-100 to-yellow-300 hover:text-black">
          Send Request
        </button>

        <p className="text-center text-sm">
          Already approved?{" "}
          <a href="/login" className="text-blue-600 underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
