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

/**
 * @swagger
 * /student/:
 *   get:
 *     summary: View student dashboard
 *     tags: [Students]
 *     responses:
 *       200:
 *         description: Rendered student dashboard
 */
router.get('/', studentController.dashboard);

/**
 * @swagger
 * /student/courses:
 *   get:
 *     summary: View available courses
 *     tags: [Students]
 *     responses:
 *       200:
 *         description: List of available courses
 */
router.get('/courses', studentController.viewCourses);

/**
 * @swagger
 * /student/courses/enroll/{id}:
 *   get:
 *     summary: Enroll in a course
 *     tags: [Students]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the course to enroll in
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully enrolled in the course
 */
router.get('/courses/enroll/:id', studentController.enrollCourse);

/**
 * @swagger
 * /student/studentQuizzes:
 *   get:
 *     summary: View available quizzes
 *     tags: [Students]
 *     responses:
 *       200:
 *         description: List of available quizzes
 */
router.get('/studentQuizzes', studentController.viewAvailableQuizzes);

/**
 * @swagger
 * /quizzes/{id}/enroll:
 *   post:
 *     summary: Enroll in a quiz
 *     tags: [Students]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the quiz to enroll in
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully enrolled in the quiz
 */
router.post('/quizzes/:id/enroll', studentController.enrollInQuiz);

// In routes/student.js

/**
 * @swagger
 * /student/viewExistingQuizzes:
 *   get:
 *     summary: View list of available quizzes for the student
 *     description: Fetches and displays a list of all quizzes that the student can attend.
 *     tags: 
 *       - Student
 *     responses:
 *       200:
 *         description: List of quizzes successfully retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Unique quiz ID.
 *                   title:
 *                     type: string
 *                     description: Title of the quiz.
 *                   courseId:
 *                     type: string
 *                     description: ID of the course the quiz belongs to.
 *                   questions:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         questionText:
 *                           type: string
 *                           description: The text of the quiz question.
 *                         options:
 *                           type: array
 *                           items:
 *                             type: string
 *                           description: Available answer options.
 *                         correctAnswer:
 *                           type: string
 *                           description: Correct answer for the quiz question.
 *       500:
 *         description: Error retrieving quizzes.
 */
router.get('/viewExistingQuizzes', studentController.viewExistingQuizzes); // View list of quizzes

/**
 * @swagger
 * /student/attendQuiz/{quizId}:
 *   get:
 *     summary: Attend a specific quiz
 *     description: Displays a quiz page for the student to answer questions of a specific quiz.
 *     tags:
 *       - Student
 *     parameters:
 *       - in: path
 *         name: quizId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the quiz to be attended
 *     responses:
 *       200:
 *         description: Quiz page successfully rendered.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: Unique quiz ID.
 *                 title:
 *                   type: string
 *                   description: Title of the quiz.
 *                 questions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       questionText:
 *                         type: string
 *                         description: The text of the quiz question.
 *                       options:
 *                         type: array
 *                         items:
 *                           type: string
 *                         description: Available answer options.
 *       404:
 *         description: Quiz not found.
 *       500:
 *         description: Error rendering the quiz page.
 */
router.get('/attendQuiz/:quizId', studentController.renderQuizPage); // Attend a specific quiz

/**
 * @swagger
 * /student/submitQuiz/{quizId}:
 *   post:
 *     summary: Submit quiz answers and view result
 *     description: Submits the student's answers for a specific quiz and returns the result.
 *     tags:
 *       - Student
 *     parameters:
 *       - in: path
 *         name: quizId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the quiz being submitted
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               answers:
 *                 type: array
 *                 description: Student's answers to the quiz
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Quiz answers successfully submitted, and result displayed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 score:
 *                   type: number
 *                   description: The student's score for the quiz.
 *                 correctAnswers:
 *                   type: number
 *                   description: Number of correct answers.
 *       400:
 *         description: Invalid quiz ID or missing answers.
 *       500:
 *         description: Error submitting the quiz or calculating results.
 */
router.post('/submitQuiz/:quizId', studentController.submitQuiz); // Submit quiz answers and view result




/**
 * @swagger
 * /student/assignments:
 *   get:
 *     summary: View all assignments
 *     tags: [Students]
 *     responses:
 *       200:
 *         description: List of available assignments
 */
router.get('/assignments', studentController.viewAssignments);

/**
 * @swagger
 * /student/assignments/{assignmentId}/submit:
 *   post:
 *     summary: Submit an assignment
 *     tags: [Students]
 *     parameters:
 *       - name: assignmentId
 *         in: path
 *         required: true
 *         description: The ID of the assignment to submit
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Assignment submitted successfully
 */
router.post('/assignments/:assignmentId/submit', fileController.upload, studentController.submitAssignmentPost);

/**
 * @swagger
 * /student/viewSubmissionStatus:
 *   get:
 *     summary: View the status of submitted assignments
 *     tags: [Students]
 *     responses:
 *       200:
 *         description: View the submission status
 */
router.get('/viewSubmissionStatus', studentController.viewSubmissionStatus);



/**
 * @swagger
 * /student/grades:
 *   get:
 *     summary: View student's grades
 *     tags: [Students]
 *     responses:
 *       200:
 *         description: Successfully retrieved student's grades
 *         content:
 *           text/html:
 *             schema:
 *               type: object
 *               properties:
 *                 assignmentGrades:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       assignmentId:
 *                         type: string
 *                         description: The ID of the assignment
 *                       title:
 *                         type: string
 *                         description: The title of the assignment
 *                       grade:
 *                         type: string
 *                         description: The grade achieved in the assignment
 *                 quizGrades:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       quizId:
 *                         type: string
 *                         description: The ID of the quiz
 *                       title:
 *                         type: string
 *                         description: The title of the quiz
 *                       grade:
 *                         type: string
 *                         description: The grade achieved in the quiz
 *                 message:
 *                   type: string
 *                   description: A message indicating the status of the grades
 *       500:
 *         description: An error occurred while fetching grades
 */
router.get('/grades', studentController.viewGrades);






// Route for viewing uploaded materials
router.get('/materials', studentController.viewMaterials);


// Notification and Reply Routes
/**
 * @swagger
 * /student/notifications:
 *   get:
 *     summary: View student notifications
 *     tags: [Students]
 *     responses:
 *       200:
 *         description: List of notifications for the student
 */
router.get('/notifications', studentController.viewStudentNotifications);

/**
 * @swagger
 * /student/respond/{notificationId}:
 *   post:
 *     summary: Respond to a notification
 *     tags: [Students]
 *     parameters:
 *       - name: notificationId
 *         in: path
 *         required: true
 *         description: The ID of the notification to respond to
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Response data for the notification
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               response:
 *                 type: string
 *                 description: The student's response
 *     responses:
 *       200:
 *         description: Response submitted successfully
 */
router.post('/respond/:notificationId', studentController.respondToNotification);


module.exports = router;
