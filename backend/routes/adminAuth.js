const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const AdminUser = require("../models/AdminUser");
const SystemConfig = require("../models/SystemConfig");

/* -------------------------------------------
   CHECK IF SUPERADMIN EXISTS
------------------------------------------- */
router.get("/superadmin/exist", async (req, res) => {
  const cfg = await SystemConfig.findOne({ key: "superadminExists" });
  res.json({ exists: !!cfg });
});

/* -------------------------------------------
   SUPERADMIN REGISTER (ONE-TIME)
------------------------------------------- */
router.post("/superadmin-register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const cfg = await SystemConfig.findOne({ key: "superadminExists" });

    if (cfg)
      return res.status(403).json({ error: "Superadmin already exists" });

    const duplicate = await AdminUser.findOne({ email });
    if (duplicate) return res.status(400).json({ error: "Email already used" });

    const hash = await bcrypt.hash(password, 10);

    const sa = await AdminUser.create({
      name,
      email,
      password: hash,
      role: "admin",
      status: "approved",
    });

    await SystemConfig.create({ key: "superadminExists", value: true });

    const token = jwt.sign(
      { id: sa._id, role: sa.role },
      process.env.JWT_SECRET
    );

    return res.json({
      ok: true,
      token,
      admin: {
        id: sa._id,
        name: sa.name,
        email: sa.email,
        role: sa.role,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server error" });
  }
});

/* -------------------------------------------
   NORMAL ADMIN REGISTER (APPROVAL REQUIRED)
------------------------------------------- */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const duplicate = await AdminUser.findOne({ email });
    if (duplicate) return res.status(400).json({ error: "Email used" });

    const hash = await bcrypt.hash(password, 10);

    await AdminUser.create({
      name,
      email,
      password: hash,
      role: "admin",
      status: "pending",
    });

    return res.json({
      ok: true,
      message: "Admin request submitted. Await approval.",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server error" });
  }
});

/* -------------------------------------------
   ADMIN / SUPERADMIN LOGIN
------------------------------------------- */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await AdminUser.findOne({ email });

    if (!admin) return res.status(400).json({ error: "No account found" });

    if (admin.role !== "superadmin" && admin.status !== "approved")
      return res.status(403).json({ error: "Access not approved yet" });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(400).json({ error: "Wrong password" });

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      ok: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server error" });
  }
});

module.exports = router;
