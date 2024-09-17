const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: String,
  description: String,
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  submissions: [{ student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, content: String, grade: Number }]
});

module.exports = mongoose.model('Assignment', assignmentSchema);

