// routes/auth.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendMail = require("../utils/sendMail.js");
const crypto = require("crypto");
const Student = require("../models/Student");

// Helper to get JWT secret safely
const JWT_SECRET = process.env.JWT_SECRET;

/* REGISTER */
router.post("/register", async (req, res) => {
  try {
    const { name, phone, dob, email, gender, college, state, roll, password } =
      req.body;

    if (!name || !email || !phone || !dob || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check email & phone duplicates

    const emailExists = await Student.findOne({ email });
    if (emailExists)
      return res.status(400).json({ error: "Email already registered" });

    const phoneExists = await Student.findOne({ phone });
    if (phoneExists)
      return res.status(400).json({ error: "Phone number already registered" });

    const nameParts = name.trim().split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || "";

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await Student.create({
      firstName,
      lastName,
      dob,
      email,
      password: hashedPassword,
      gender,
      phone,
      state,
      collegeName: college,
      registeredNumber: roll,
      universityName: college,
    });

    const token = jwt.sign(
      { id: student._id, role: "student" },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.json({
      ok: true,
      message: "Registration successful",
      token,
      student: {
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || "field";
      return res.status(400).json({ error: `${field} already exists` });
    }
    return res.status(500).json({ error: "Server error during registration" });
  }
});

/* LOGIN */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email & password are required" });

    const student = await Student.findOne({ email });
    if (!student)
      return res
        .status(400)
        .json({ error: "No account found. Please register." });
    if (!student.password) {
      return res.status(400).json({
        error: "Password not set. Please reset your password first.",
      });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) return res.status(400).json({ error: "Incorrect password" });

    const token = jwt.sign(
      { id: student._id, role: "student" },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.json({
      ok: true,
      message: "Login successful",
      token,
      student: {
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ error: "Server error during login" });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ error: "Token and password required" });
    }

    const user = await Student.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        error: "Invalid or expired token",
      });
    }

    // 🔐 hash new password
    user.password = await bcrypt.hash(password, 10);

    // 🧹 clear reset fields
    user.resetToken = null;
    user.resetTokenExpiry = null;

    // ✅ THIS IS THE CRITICAL FIX
    await user.save({ validateBeforeSave: false });

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// routes/auth.js

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await Student.findOne({ email });
    console.log("FORGOT PASSWORD:", email);
    console.log("USER FOUND:", !!user);

    if (!user) {
      return res.json({
        message: "If this email exists, reset link sent",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;

    // ✅ THIS LINE FIXES YOUR ERROR
    await user.save({ validateBeforeSave: false });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    console.log("RESET LINK:", resetLink);

    res.json({ message: "Reset link generated" });
  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
