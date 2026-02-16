// routes/documents.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const DocumentSubmission = require("../models/DocumentSubmission");
const Student = require("../models/Student");
const AdminUser = require("../models/AdminUser");

//const Notification = require("../models/Notification").default;

/* ---------------- ENV CHECK ---------------- */
if (!process.env.JWT_SECRET) {
  console.error("❌ JWT_SECRET is missing in .env");

}

// ---------------- UPDATE SUBMISSION ----------------
router.put("/update/:id", authMiddleware, async (req, res) => {
  try {
    const sub = await DocumentSubmission.findById(req.params.id);

    if (!sub) {
      return res.status(404).json({ error: "Not found" });
    }

    // 🔒 BLOCK EDIT IF VERIFIED
    if (sub.status === "Verified") {
      return res.status(403).json({
        error: "Verified submissions cannot be edited",
      });
    }

    // ✅ UPDATE FIELDS
    sub.fields = {
      ...sub.fields,
      ...req.body,
    };

    await sub.save();

    res.json({ ok: true, message: "Submission updated successfully" });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ---------------- UPLOAD SETUP ---------------- */
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});

const upload = multer({ storage });

/* ---------------- AUTH MIDDLEWARE ---------------- */
function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authorization token missing" });
    }

    const token = authHeader.split(" ")[1];

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (payload.role !== "student") {
      return res.status(403).json({ error: "Access denied" });
    }

    req.studentId = payload.id;
    next();
  } catch (err) {
    console.error("Token verify error:", err.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

/* ---------------- FILE FIELDS ---------------- */
const fileFields = upload.fields([
  { name: "passport", maxCount: 1 },
  { name: "aadhaarFile", maxCount: 1 },
  { name: "tenthCertificate", maxCount: 1 },
  { name: "interCertificate", maxCount: 1 },
  { name: "graduationCertificate", maxCount: 1 },
  { name: "transferCertificate", maxCount: 1 },
]);

/* ---------------- SUBMIT DOCUMENTS ---------------- */
router.post("/submit", authMiddleware, fileFields, async (req, res) => {
  try {
    const student = await Student.findById(req.studentId);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const fields = { ...req.body };
    const files = {};

    const keys = [
      "passport",
      "aadhaarFile",
      "tenthCertificate",
      "interCertificate",
      "graduationCertificate",
      "transferCertificate",
    ];

    keys.forEach((k) => {
      if (req.files?.[k]?.[0]) {
        const f = req.files[k][0];
        files[k] = {
          url: `/uploads/${f.filename}`,
          filename: f.originalname,
        };
      }
    });

    const submission = await DocumentSubmission.create({
      student: student._id,
      fields,
      requiredFiles: files,
      status: "Pending",
    });

    /* ---------------- NOTIFY ADMIN ---------------- */
    const admin = await AdminUser.findOne({
      role: { $in: ["admin", "superadmin"] },
    });

    if (admin) {
      // await Notification.create({
      //   senderRole: "STUDENT",
      //   senderId: student._id,
      //   receiverRole: "ADMIN",
      //   receiverId: admin._id,
      //   student: student._id,
      //   target: "admin",
      //   message: `New document submission from ${student.firstName}`,
      //   isRead: false,
      // });
    } else {
      console.warn("⚠ No admin found to notify");
    }

    return res.json({ ok: true, submission });
  } catch (err) {
    console.error("Submit Error:", err);
    return res.status(500).json({ error: "Server error during submission" });
  }
});

/* ---------------- MY SUBMISSIONS ---------------- */
router.get("/my-submissions", authMiddleware, async (req, res) => {
  try {
    const subs = await DocumentSubmission.find({
      student: req.studentId,
    }).sort({ createdAt: -1 });

    return res.json({ subs });
  } catch (err) {
    console.error("Fetch submissions error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});
/* ---------------- GET SINGLE SUBMISSION (FOR EDIT) ---------------- */
router.get("/submission/:id", authMiddleware, async (req, res) => {
  try {
    const sub = await DocumentSubmission.findById(req.params.id);

    if (!sub) {
      return res.status(404).json({ error: "Submission not found" });
    }

    // 🔒 Security: student can access only their submission
    if (sub.student.toString() !== req.studentId) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    return res.json({ sub });
  } catch (err) {
    console.error("Fetch single submission error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});


// routes/docs.js
router.get("/check-phone/:phone", async (req, res) => {
  try {
    const exists = await DocumentSubmission.exists({
      "fields.phone": req.params.phone,
    });
    res.json({ exists: !!exists });
  } catch (err) {
    res.status(500).json({ exists: false });
  }
});

module.exports = router;
