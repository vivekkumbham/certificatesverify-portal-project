// // models/Notification.js
// import mongoose from "mongoose";

// const notificationSchema = new mongoose.Schema({
//   senderRole: {
//     type: String,
//     enum: ["STUDENT", "ADMIN"],
//     required: true,
//   },
//   senderId: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//   },
//   receiverRole: {
//     type: String,
//     enum: ["STUDENT", "ADMIN"],
//     required: true,
//   },
//   receiverId: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//   },
//   message: {
//     type: String,
//     required: true,
//   },
//   isRead: {
//     type: Boolean,
//     default: false,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// export default mongoose.model("Notification", notificationSchema);
