import React, { useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const nav = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    if (!password || !confirm) {
      return alert("All fields required");
    }

    if (password !== confirm) {
      return alert("Passwords do not match");
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:4000/api/auth/reset-password",
        { token, password },
        { headers: { "Content-Type": "application/json" } }
      );

      alert(res.data.message || "Password reset successful");
      nav("/login");
    } catch (err) {
      console.error(err);
      alert("Invalid or expired reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 to-purple-900">
      <form
        onSubmit={handleReset}
        className="bg-white/10 p-8 rounded-xl w-96 text-white"
      >
        <h2 className="text-2xl mb-6 text-center">Reset Password</h2>

        <input
          type="password"
          placeholder="New Password"
          className="w-full p-3 mb-4 rounded text-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full p-3 mb-6 rounded text-black"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        <button
          disabled={loading}
          className="w-full bg-yellow-300 text-black py-3 rounded"
        >
          {loading ? "Updating..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
