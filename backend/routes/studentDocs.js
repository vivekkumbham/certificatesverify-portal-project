const express = require("express");
const router = express.Router();
const DocumentSubmission = require("../models/DocumentSubmission");
const authStudent = require("../middleware/authStudent");

router.get("/my", authStudent, async (req, res) => {
  const doc = await DocumentSubmission.findOne({
    student: req.user.id,
  }).sort({ createdAt: -1 });

  res.json({ doc });
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
