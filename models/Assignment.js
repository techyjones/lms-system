const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: String,
  courseId: mongoose.Schema.Types.ObjectId,
  dueDate: Date,
  fileUrl: String,
});

module.exports = mongoose.model('Assignment', assignmentSchema);
