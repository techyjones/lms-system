const mongoose = require('mongoose');

const studentSubmissionSchema = new mongoose.Schema({
  assignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment', // Reference to the Assignment model
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model (for students)
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  grade: {
    type: Number,
    default: null // Default to null until graded
  },
  createdAt: {
    type: Date,
    default: Date.now // Automatically set the submission date when created
  }
});

module.exports = mongoose.model('StudentSubmission', studentSubmissionSchema);
