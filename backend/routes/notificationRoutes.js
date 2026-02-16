// const express = require("express");
// const jwt = require("jsonwebtoken");
// //const Notification = require("../models/Notification");

// const router = express.Router();
// const JWT_SECRET = process.env.JWT_SECRET;

// /* ================= AUTH ================= */

// function adminAuth(req, res, next) {
//   const header = req.headers.authorization;
//   if (!header?.startsWith("Bearer "))
//     return res.status(401).json({ error: "Missing token" });

//   try {
//     const token = header.split(" ")[1];
//     const payload = jwt.verify(token, JWT_SECRET);

//     if (!["admin", "superadmin"].includes(payload.role)) {
//       return res.status(403).json({ error: "Forbidden" });
//     }

//     req.adminId = payload.id;
//     next();
//   } catch (err) {
//     console.error("Admin auth error:", err.message);
//     return res.status(401).json({ error: "Invalid token" });
//   }
// }

// function studentAuth(req, res, next) {
//   const header = req.headers.authorization;
//   if (!header?.startsWith("Bearer "))
//     return res.status(401).json({ error: "Missing token" });

//   try {
//     const token = header.split(" ")[1];
//     const payload = jwt.verify(token, JWT_SECRET);

//     if (payload.role !== "student") {
//       return res.status(403).json({ error: "Forbidden" });
//     }

//     req.studentId = payload.id;
//     next();
//   } catch (err) {
//     return res.status(401).json({ error: "Invalid token" });
//   }
// }

// /* ================= ADMIN ================= */

// /**
//  * ✅ Get admin notifications
//  */
// // router.get("/admin", adminAuth, async (req, res) => {
// //   try {
// //     const notifications = await Notification.find({
// //       receiverRole: "ADMIN",
// //     }).sort({ createdAt: -1 });

// //     res.json({ logs: notifications });
// //   } catch (err) {
// //     console.error("Admin notifications error:", err);
// //     res.status(500).json({ error: "Failed to load notifications" });
// //   }
// // });

// /**
//  * ✅ Get unread count
//  */
// // router.get("/admin/count", adminAuth, async (req, res) => {
// //   try {
// //     console.log("➡️ COUNT ROUTE HIT");
// //     console.log("➡️ Admin ID:", req.adminId);
// //     console.log("➡️ JWT_SECRET:", process.env.JWT_SECRET);

// //     const count = await Notification.countDocuments({
// //       receiverRole: "ADMIN",
// //       isRead: false,
// //     });

// //     console.log("➡️ COUNT RESULT:", count);

// //     res.json({ count });
// //   } catch (err) {
// //     console.error("🔥 FULL ERROR OBJECT:", err);
// //     console.error("🔥 ERROR MESSAGE:", err.message);
// //     console.error("🔥 ERROR STACK:", err.stack);

// //     res.status(500).json({ error: "Failed to load notification count" });
// //   }
// // });

// /**
//  * ✅ Mark admin notification as read
//  */
// router.put("/read/:id", adminAuth, async (req, res) => {
//   try {
//     await Notification.findByIdAndUpdate(req.params.id, {
//       isRead: true,
//     });
//     res.json({ ok: true });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to update notification" });
//   }
// });

// /* ================= STUDENT ================= */

// /**
//  * ✅ Get student notifications
//  */
// router.get("/student", studentAuth, async (req, res) => {
//   try {
//     const notifications = await Notification.find({
//       receiverRole: "STUDENT",
//       receiverId: req.studentId,
//     }).sort({ createdAt: -1 });

//     res.json(notifications);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to load notifications" });
//   }
// });

// /**
//  * ✅ Mark student notification as read
//  */
// router.put("/student/read/:id", studentAuth, async (req, res) => {
//   try {
//     await Notification.findByIdAndUpdate(req.params.id, {
//       isRead: true,
//     });
//     res.json({ ok: true });
//   } catch (err) {
//     res.status(500).json({ error: "Failed" });
//   }
// });

// module.exports = router;
