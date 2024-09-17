const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const Assignment = require('../models/Assignment');
const Quiz = require('../models/Quiz');
const User = require('../models/User');
const studentController = require('../controllers/studentController');
const fileController = require('../controllers/fileController');


router.use((req, res, next) => {
  if (req.session.user && req.session.user.role === 'student') {
    next();
  } else {
    res.redirect('/auth/login');
  }
});

// Student Dashboard
router.get('/', studentController.dashboard);

// View Courses
router.get('/courses', studentController.viewCourses);

// Enroll in Course
router.get('/courses/enroll/:id', studentController.enrollCourse);

// View Assignments
router.get('/assignments', studentController.viewAssignments);

// View Grades
router.get('/grades', studentController.viewGrades);

// Route to view uploaded materials
router.get('/materials', studentController.viewMaterials);

module.exports = router;
