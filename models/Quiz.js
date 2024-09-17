const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: String,
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  questions: [{ question: String, options: [String], answer: String }]
});

module.exports = mongoose.model('Quiz', quizSchema);
