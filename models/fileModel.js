const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  originalName: String,
  filename: String,
  path: String,
  size: Number,
  mimetype: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  category: { type: String, enum: ['assignment', 'material'] }
});

module.exports = mongoose.model('File', fileSchema);
