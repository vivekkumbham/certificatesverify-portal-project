const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const DocumentSubmission = require("../models/DocumentSubmission");
const { adminAuth } = require("../middleware/authAdmin");
//const Notification = require("../models/Notification");

const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});

const upload = multer({ storage });

router.get("/pending", adminAuth, async (req, res) => {
  try {
    const list = await DocumentSubmission.find({ status: "Pending" })
      .populate("student")
      .sort({ createdAt: -1 });
    res.json({ list });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server" });
  }
});

router.get("/all", adminAuth, async (req, res) => {
  try {
    const list = await DocumentSubmission.find()
      .populate("student")
      .sort({ createdAt: -1 });
    res.json({ list });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server" });
  }
});

router.post(
  "/verify/:id",
  adminAuth,
  upload.array("adminFiles", 10),
  async (req, res) => {
    try {
      const id = req.params.id;
      const submission = await DocumentSubmission.findById(id).populate(
        "student"
      );
      if (!submission) return res.status(404).json({ error: "not found" });
      if (req.files && req.files.length) {
        const adminFiles = req.files.map((f) => ({
          url: `/uploads/${f.filename}`,
          filename: f.originalname,
        }));
        submission.adminFiles.scannedCopies = (
          submission.adminFiles.scannedCopies || []
        ).concat(adminFiles);
      }
      submission.status = req.body.status || "Verified";
      submission.adminComments = req.body.comments || "";
      submission.updatedAt = new Date();
      await submission.save();
      try {
        const finalStatus = req.body.status || "Verified";
        // await Notification.create({
        //   senderRole: "ADMIN",
        //   senderId: req.adminId,
        //   receiverRole: "STUDENT",
        //   receiverId: submission.student._id,
        //   student: submission.student._id,
        //   target: "student",
        //   message:
        //     finalStatus === "verified"
        //       ? "✅ Your documents have been verified"
        //       : "❌ Your documents have been rejected",
        //   isRead: false,
        // });
      } catch (e) {
        console.error(e);
      }

      res.json({ ok: true, submission });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "server" });
    }
  }
);

module.exports = router;
