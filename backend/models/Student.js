// models/Student.js
const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, default: "" },
  dob: { type: String, default: "" },
  gender: { type: String, default: "" },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true }, // set unique if you want phones unique
  address: { type: String, default: "" },
  registeredNumber: { type: String }, // roll/reg no
  state: { type: String },
  group: { type: String },
  universityName: { type: String },
  collegeName: { type: String },
  sop: { type: String },
  documents: {
    passport: { url: String, filename: String },
    aadhaarFile: { url: String, filename: String },
    tenthCertificate: { url: String, filename: String },
    interCertificate: { url: String, filename: String },
    graduationCertificate: { url: String, filename: String },
    transferCertificate: { url: String, filename: String },
  },
  password: { type: String, required: true },
  status: { type: String, default: "Pending" },
  adminComments: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  resetToken: {
    type: String,
    default: null,
  },
  resetTokenExpiry: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model("Student", StudentSchema);
