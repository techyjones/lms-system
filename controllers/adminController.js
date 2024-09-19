const User = require('../models/User');
const Course = require('../models/Course');
const Quiz = require('../models/Quiz');
const Assignment = require('../models/Assignment');

// Dashboard
exports.dashboard = (req, res) => {
  res.render('admin/dashboard');
};

// User Management
exports.manageUsers = async (req, res) => {
  const users = await User.find();
  res.render('admin/users', { users });
};

// System Configuration
exports.config = (req, res) => {
  res.render('admin/config');
};

// Manage Courses, Quizzes, and Assignments
exports.manageContent = async (req, res) => {
  const courses = await Course.find();
  const quizzes = await Quiz.find();
  const assignments = await Assignment.find();
  res.render('admin/manage', { courses, quizzes, assignments });
};
