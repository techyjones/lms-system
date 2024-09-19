const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const fileController = require('../controllers/fileController');
const User = require('../models/User');

// Middleware to check if user is a teacher
router.use((req, res, next) => {
  if (req.session.user && req.session.user.role === 'teacher') {
    next();
  } else {
    res.redirect('/auth/login');
  }
});

// Dashboard Route
router.get('/', teacherController.dashboard);

// Course Routes
router.get('/createCourse', teacherController.renderCreateCourseForm);
router.get('/courses', teacherController.viewCourses);      // View all courses by teacher
router.post('/courses', teacherController.createCoursePost); // Create a new course

// Quiz Routes
router.get('/quizzes', teacherController.viewQuizzes);       // View all quizzes
router.post('/quizzes', teacherController.createQuizPost);   // Create a new quiz

// Assignment Routes
router.get('/assignments', teacherController.viewAssignments);     // View all assignments
router.post('/assignments', teacherController.createAssignmentPost); // Create a new assignment
router.post('/assignments/:id/grade', teacherController.gradeAssignmentPost); // Grade an assignment

// File Upload Routes
router.get('/upload', teacherController.renderUploadForm); // Render upload form
router.post('/upload', fileController.upload, teacherController.uploadFilePost); // Handle file upload

// View Uploaded Files
router.get('/viewContent', teacherController.viewUploadedFiles); // View uploaded files

router.get('/courses/:id/students', teacherController.viewEnrolledStudents);

module.exports = router;
