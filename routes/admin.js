const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Course = require('../models/Course');
const Quiz = require('../models/Quiz');
const Assignment = require('../models/Assignment');
const adminController = require('../controllers/adminController');
// Middleware to check if user is an admin
router.use((req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') {
    next();
  } else {
    res.redirect('/auth/login');
  }
});
router.get('/', adminController.dashboard);
router.get('/users', adminController.manageUsers);
router.get('/config', adminController.config);
router.get('/manage', adminController.manageContent);

// Admin Dashboard
router.get('/', (req, res) => {
  res.render('admin/dashboard');
});


router.get('/users', async (req, res) => {
  const users = await User.find({});
  res.render('admin/users', { users });
});


router.get('/config', (req, res) => {
  res.render('admin/config');
});


router.get('/manage', async (req, res) => {
  const courses = await Course.find({});
  const quizzes = await Quiz.find({});
  const assignments = await Assignment.find({});
  res.render('admin/manage', { courses, quizzes, assignments });
});

module.exports = router;
