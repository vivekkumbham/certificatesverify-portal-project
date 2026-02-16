const mongoose = require("mongoose");
const DocSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  fields: {
    firstName: String,
    lastName: String,
    phone: String,
    registeredNumber: String,
    collegeName: String,
    state: String,
    country: String,
    email: String,
    address: String,
    dob: String,
    gender: String,
    group: String,
  },
  requiredFiles: {},
  adminFiles: {
    scannedCopies: [{ url: String, filename: String }],
    stampedPapers: [{ url: String, filename: String }],
  },
  status: {
    type: String,
    enum: ["Pending", "Verified", "Rejected"],
    default: "Pending",
  },
  adminComments: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
});
module.exports = mongoose.model("DocumentSubmission", DocSchema);
