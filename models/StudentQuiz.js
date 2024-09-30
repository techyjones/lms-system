const mongoose = require('mongoose');

const studentQuizSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz', // Reference to the Quiz model
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model (for the student)
    required: true
  },
  grade: {
    type: Number,
    min: 1,
    max: 10,
    default: null // Initially, no grade
  }
});

module.exports = mongoose.model('StudentQuiz', studentQuizSchema);
