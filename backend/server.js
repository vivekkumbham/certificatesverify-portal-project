// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcryptjs");
const downloadRoute = require("./routes/download");
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));

/* CORS */
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

app.use(express.json());

/* Routes */
app.use("/api/docs", require("./routes/documents")); // SINGLE docs route (document submission)
app.use("/api/auth", require("./routes/auth"));

// Admin & other routes (only if present in your project)
try {
  app.use("/api/admin/docs", require("./routes/adminDocs"));
} catch (e) {
  console.warn("adminDocs not found");
}
try {
  app.use("/api/admin-auth", require("./routes/adminAuth"));
} catch (e) {
  console.warn("adminAuth not found");
}
try {
  app.use("/api/admin-manage", require("./routes/adminManage"));
} catch (e) {
  console.warn("adminManage not found");
}
try {
  app.use("/api/admin/history", require("./routes/history"));
} catch (e) {
  console.warn("history not found");
}
try {
  app.use("/api/admin/stats", require("./routes/adminStats"));
} catch (e) {
  console.warn("adminStats not found");
}

// try {
//   app.use("/api/notifications", require("./routes/notificationRoutes"));
// } catch (e) {
//   console.warn("Notifications not found");
// }

/* Static uploads */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/download", downloadRoute);

/* MongoDB */
const MONGO = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/studydocs";
mongoose
  .connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error", err));

/* Auto-create default SuperAdmin (if your project uses this) */
const AdminUser =
  require("./models/AdminUser").default || require("./models/AdminUser");
const SystemConfig = (() => {
  try {
    return require("./models/SystemConfig");
  } catch (e) {
    return null;
  }
})();
async function createDefaultSuperAdmin() {
  try {
    if (!SystemConfig) return;
    const cfg = await SystemConfig.findOne({ key: "superadminExists" });
    if (cfg) return;
    const email = "careersnavigators.com@gmail.com";
    const password = "admin@123";
    const name = "Default SuperAdmin";
    const existing = await AdminUser.findOne({ email });
    if (existing) {
      await SystemConfig.create({ key: "superadminExists", value: true });
      return;
    }
    const hashed = await bcrypt.hash(password, 10);
    await AdminUser.create({
      name,
      email,
      password: hashed,
      role: "superadmin",
      status: "approved",
    });
    await SystemConfig.create({ key: "superadminExists", value: true });
    console.log("✅ Default SuperAdmin created:", email);
  } catch (err) {
    console.error("Failed to create default superadmin", err);
  }
}
createDefaultSuperAdmin();

/* Start server */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
