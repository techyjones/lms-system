const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: { type: String, enum: ['teacher', 'student', 'admin'] }
});

module.exports = mongoose.model('User', userSchema);
