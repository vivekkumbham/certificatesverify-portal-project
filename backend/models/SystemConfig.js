// models/SystemConfig.js
const mongoose = require('mongoose');
const SystemConfigSchema = new mongoose.Schema({
  key: { type: String, unique: true },
  value: {}
});
module.exports = mongoose.model('SystemConfig', SystemConfigSchema);
