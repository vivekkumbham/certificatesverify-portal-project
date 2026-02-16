const express = require("express");
const router = express.Router();
const DocumentSubmission = require("../models/DocumentSubmission");
const { adminAuth } = require("../middleware/authAdmin");

router.get("/graph-stats", adminAuth, async (req, res) => {
  const submissions = await DocumentSubmission.find();

  const yearCounts = {};
  const verifiedCounts = {};
  const rejectedCounts = {};

  submissions.forEach((s) => {
    const year = new Date(s.createdAt).getFullYear();

    yearCounts[year] = (yearCounts[year] || 0) + 1;

    if (s.status === "Verified") {
      verifiedCounts[year] = (verifiedCounts[year] || 0) + 1;
    }

    if (s.status === "Rejected") {
      rejectedCounts[year] = (rejectedCounts[year] || 0) + 1;
    }
  });

  res.json({
    yearlySubmissions: Object.keys(yearCounts).map((y) => ({ year: y, count: yearCounts[y] })),
    yearlyVerified: Object.keys(verifiedCounts).map((y) => ({ year: y, count: verifiedCounts[y] })),
    yearlyRejected: Object.keys(rejectedCounts).map((y) => ({ year: y, count: rejectedCounts[y] })),
  });
});

module.exports = router;
