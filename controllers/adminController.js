const User = require('../models/User');
const Course = require('../models/Course');
const Quiz = require('../models/Quiz');
const Assignment = require('../models/Assignment');


exports.dashboard = (req, res) => {
  res.render('admin/dashboard');
};


exports.manageUsers = async (req, res) => {
  const users = await User.find();
  res.render('admin/users', { users });
};


exports.config = (req, res) => {
  res.render('admin/config');
};


exports.manageContent = async (req, res) => {
  const courses = await Course.find();
  const quizzes = await Quiz.find();
  const assignments = await Assignment.find();
  res.render('admin/manage', { courses, quizzes, assignments });
};
