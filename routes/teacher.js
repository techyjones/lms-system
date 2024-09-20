const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const fileController = require('../controllers/fileController');
const User = require('../models/User');


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
router.get('/courses/:id/edit', teacherController.renderEditCourseForm);
router.post('/courses/:id/edit', teacherController.updateCourse);
router.post('/courses/:id/delete', teacherController.deleteCourse);



// Quiz Routes
router.get('/quizzes', teacherController.viewQuizzes); 
router.get('/quizzes/:id/edit', teacherController.renderEditQuizForm); 
router.post('/quizzes/:id', teacherController.updateQuizPost); 
router.delete('/quizzes/:id', teacherController.deleteQuizPost); 
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

router.get('/courses/:id/students', teacherController.viewEnrolledStudents);

module.exports = router;
