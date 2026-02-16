const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Student = require("../models/Student");

// Create uploads folder if missing
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});

const upload = multer({ storage });

// FINAL SUBMISSION API (All 3 steps)
router.post(
  "/submit",
  upload.fields([
    { name: "tenthCertificate", maxCount: 1 },
    { name: "interCertificate", maxCount: 1 },
    { name: "graduationCertificate", maxCount: 1 },
    { name: "transferCertificate", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { firstName, lastName, dob, gender, email, phone, address, sop } =
        req.body;

      // 🔴 DUPLICATE PHONE CHECK
      const existingStudent = await Student.findOne({ phone });
      if (existingStudent) {
        return res.status(400).json({
          error:
            "This phone number is already used. Please use a different number.",
        });
      }

      // Build documents object
      const documents = {};

      const map = {
        tenthCertificate: "tenthCertificate",
        interCertificate: "interCertificate",
        graduationCertificate: "graduationCertificate",
        transferCertificate: "transferCertificate",
      };

      for (const key in map) {
        if (req.files[key]) {
          const file = req.files[key][0];
          documents[key] = {
            url: `/uploads/${file.filename}`,
            filename: file.originalname,
          };
        }
      }

      // Save Student Record
      await Student.create({
        firstName,
        lastName,
        dob,
        gender,
        email,
        phone,
        address,
        sop,
        documents,
        status: "Pending",
      });

      res.json({
        success: true,
        message: "Registration + SOP + Documents submitted successfully",
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

module.exports = router;
