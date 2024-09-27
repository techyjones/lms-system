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


router.get('/courses', studentController.viewCourses);


router.get('/courses/enroll/:id', studentController.enrollCourse);

router.get('/studentQuizzes', studentController.viewAvailableQuizzes);
router.post('/quizzes/:id/enroll', studentController.enrollInQuiz);


// View Assignments Route
router.get('/assignments', studentController.viewAssignments);

// Route for submitting assignments
router.post('/assignments/:assignmentId/submit', fileController.upload, studentController.submitAssignmentPost);

// View Submission Status Route
router.get('/viewSubmissionStatus', studentController.viewSubmissionStatus);


// Route to view grades
router.get('/grades', studentController.viewGrades);


// Route for viewing uploaded materials
router.get('/materials', studentController.viewMaterials);


// Notification and Reply Routes
router.get('/notifications', studentController.viewNotifications);
router.post('/notifications/:id/reply', studentController.replyNotification);


module.exports = router;
