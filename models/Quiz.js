// models/Quiz.js
const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course', // Assuming there's a Course model
    required: true
  },
  questions: [
    { 
      questionText: String,
      options: [String], // Array of options
      correctAnswer: String // Store the correct answer
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Quiz', quizSchema);
