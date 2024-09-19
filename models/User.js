const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: { type: String, enum: ['teacher', 'student', 'admin'] },
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }] 
});

module.exports = mongoose.model('User', userSchema);
