const express = require("express");
const router = express.Router();
const AdminUser = require("../models/AdminUser");
const { adminAuth, requireSuperadmin } = require("../middleware/authAdmin");

// ------- GET PENDING ADMINS -------
router.get("/pending", adminAuth, requireSuperadmin, async (req, res) => {
  const pending = await AdminUser.find({ status: "pending" }).select("-password");
  res.json({ pending });
});

// ------- GET APPROVED ADMINS (NEEDED FOR DASHBOARD) -------
router.get("/all", adminAuth, requireSuperadmin, async (req, res) => {
  const approved = await AdminUser.find({ status: "approved" }).select("-password");
  
  res.json({ approved });
});

// ------- APPROVE ADMIN -------
router.post("/approve/:id", adminAuth, requireSuperadmin, async (req, res) => {
  await AdminUser.findByIdAndUpdate(req.params.id, { status: "approved" });
  res.json({ ok: true });
});

// ------- REJECT ADMIN -------
router.post("/reject/:id", adminAuth, requireSuperadmin, async (req, res) => {
  await AdminUser.findByIdAndUpdate(req.params.id, { status: "rejected" });
  res.json({ ok: true });
});

module.exports = router;
