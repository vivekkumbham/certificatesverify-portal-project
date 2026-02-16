const express = require("express");
const router = express.Router();
const DocumentSubmission = require("../models/DocumentSubmission");
const { adminAuth } = require("../middleware/authAdmin");

router.get("/", adminAuth, async (req, res) => {
  const records = await DocumentSubmission.find()
    .populate("student")
    .sort({ createdAt: -1 });

  res.json({ records });
});

module.exports = router;
