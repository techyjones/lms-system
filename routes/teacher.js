const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const fileController = require('../controllers/fileController');

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
router.get('/courses', teacherController.viewCourses);      
router.post('/courses', teacherController.createCoursePost); 

// Quiz Routes
router.get('/quizzes', teacherController.viewQuizzes);       
router.post('/quizzes', teacherController.createQuizPost);   

// Assignment Routes
router.get('/assignments', teacherController.viewAssignments);     
router.post('/assignments', teacherController.createAssignmentPost); 
router.post('/assignments/:id/grade', teacherController.gradeAssignmentPost); 

// File Upload Routes
router.get('/upload', teacherController.renderUploadForm); 
router.post('/upload', fileController.upload, teacherController.uploadFilePost); 

// View Uploaded Files
router.get('/viewContent', teacherController.viewUploadedFiles); 

module.exports = router;
