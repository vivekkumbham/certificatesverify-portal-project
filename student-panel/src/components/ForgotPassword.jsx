// components/ForgotPassword.jsx
import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const nav = useNavigate();

  const sendResetLink = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email) {
      setError("Please enter your email");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:4000/api/auth/forgot-password",
        { email },
        { headers: { "Content-Type": "application/json" } }
      );

      setMessage(res.data?.message || "Reset link sent successfully");

      // optional redirect after 3 seconds
      setTimeout(() => {
        nav("/login");
      }, 3000);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Unable to send reset link. Try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-black via-indigo-900 to-purple-900 flex items-center justify-center relative">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-lg"
      >
        <h2 className="text-3xl font-semibold text-center text-white mb-4">
          Forgot Password
        </h2>

        <p className="text-gray-300 text-center mb-6 text-sm">
          Enter your registered email. We’ll send a password reset link.
        </p>

        {message && (
          <p className="text-green-400 text-center text-sm mb-4">
            {message}
          </p>
        )}

        {error && (
          <p className="text-red-400 text-center text-sm mb-4">
            {error}
          </p>
        )}

        <form onSubmit={sendResetLink} className="space-y-5">
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-3 text-gray-300" />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 text-white rounded-lg outline-none border border-white/20"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-green-100 via-lime-100 to-yellow-100 rounded-full font-semibold disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          <p className="text-center text-gray-300 text-sm">
            Remember your password?{" "}
            <span
              onClick={() => nav("/login")}
              className="text-pink-400 cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
