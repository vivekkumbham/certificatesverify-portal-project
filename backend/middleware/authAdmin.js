//middleware/authAdmin.js
const jwt = require("jsonwebtoken");
const AdminUser = require("../models/AdminUser");

exports.adminAuth = function (req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "No token" });

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.adminId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

exports.requireSuperadmin = async function (req, res, next) {
  const admin = await AdminUser.findById(req.adminId);
  if (!admin) return res.status(404).json({ error: "Admin not found" });

  if (admin.role !== "superadmin")
    return res.status(403).json({ error: "Not authorized" });

  next();
};
