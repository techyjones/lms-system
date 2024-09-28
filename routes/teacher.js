const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const fileController = require('../controllers/fileController');
const User = require('../models/User');
const multer = require('multer');
const StudentQuiz = require('../models/StudentQuiz');
/**
 * Middleware to check if user is authenticated and authorized as a teacher
 */
router.use((req, res, next) => {
  if (req.session.user && req.session.user.role === 'teacher') {
    next();
  } else {
    res.redirect('/auth/login');
  }
});

/**
 * @swagger
 * /teacher:
 *   get:
 *     summary: Teacher dashboard
 *     responses:
 *       200:
 *         description: Render teacher dashboard
 */
router.get('/', teacherController.dashboard);

/**
 * @swagger
 * /teacher/createCourse:
 *   get:
 *     summary: Render the form to create a new course
 *     responses:
 *       200:
 *         description: Render create course form
 */
router.get('/createCourse', teacherController.renderCreateCourseForm);

/**
 * @swagger
 * /teacher/courses:
 *   get:
 *     summary: Retrieve all courses
 *     responses:
 *       200:
 *         description: A list of courses
 */
router.get('/courses', teacherController.viewCourses);

/**
 * @swagger
 * /teacher/courses:
 *   post:
 *     summary: Create a new course
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Course created successfully
 */
router.post('/courses', teacherController.createCoursePost);

/**
 * @swagger
 * /teacher/courses/{id}/edit:
 *   get:
 *     summary: Render the form to edit a course
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the course to edit
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Render edit course form
 */
router.get('/courses/:id/edit', teacherController.renderEditCourseForm);

/**
 * @swagger
 * /teacher/courses/{id}/edit:
 *   post:
 *     summary: Update a course
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the course to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Course updated successfully
 *       404:
 *         description: Course not found
 */
router.post('/courses/:id/edit', teacherController.updateCourse);

/**
 * @swagger
 * /teacher/courses/{id}/delete:
 *   post:
 *     summary: Delete a course
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the course to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Course deleted successfully
 *       404:
 *         description: Course not found
 */
router.post('/courses/:id/delete', teacherController.deleteCourse);

/**
 * @swagger
 * /teacher/quizzes:
 *   get:
 *     summary: Retrieve all quizzes
 *     responses:
 *       200:
 *         description: A list of quizzes
 */
router.get('/quizzes', teacherController.viewQuizzes);

/**
 * @swagger
 * /teacher/createQuiz:
 *   get:
 *     summary: Render the form to create a new quiz
 *     responses:
 *       200:
 *         description: Render create quiz form
 */
router.get('/createQuiz', teacherController.renderCreateQuizForm);

/**
 * @swagger
 * /teacher/quizzes/create:
 *   get:
 *     summary: Render the form to create a new quiz
 *     responses:
 *       200:
 *         description: Render create quiz form
 */
router.get('/quizzes/create', teacherController.renderCreateQuizForm);

/**
 * @swagger
 * /teacher/quizzes:
 *   post:
 *     summary: Create a new quiz
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               questions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     question:
 *                       type: string
 *                     options:
 *                       type: array
 *                       items:
 *                         type: string
 *                     correctAnswer:
 *                       type: string
 *     responses:
 *       201:
 *         description: Quiz created successfully
 */
router.post('/quizzes', teacherController.createQuizPost);

/**
 * @swagger
 * /teacher/quizzes/{id}/edit:
 *   get:
 *     summary: Render the form to edit a quiz
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the quiz to edit
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Render edit quiz form
 */
router.get('/quizzes/:id/edit', teacherController.renderEditQuizForm);

/**
 * @swagger
 * /teacher/quizzes/{id}:
 *   post:
 *     summary: Update a quiz
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the quiz to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               questions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     question:
 *                       type: string
 *                     options:
 *                       type: array
 *                       items:
 *                         type: string
 *                     correctAnswer:
 *                       type: string
 *     responses:
 *       200:
 *         description: Quiz updated successfully
 *       404:
 *         description: Quiz not found
 */
router.post('/quizzes/:id', teacherController.updateQuizPost);

/**
 * @swagger
 * /teacher/quizzes/{id}:
 *   delete:
 *     summary: Delete a quiz
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the quiz to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Quiz deleted successfully
 *       404:
 *         description: Quiz not found
 */
router.delete('/quizzes/:id', teacherController.deleteQuizPost);

/**
 * @swagger
 * /teacher/assignments:
 *   get:
 *     summary: Retrieve all assignments
 *     responses:
 *       200:
 *         description: A list of assignments
 */
router.get('/assignments', teacherController.viewAssignments);

/**
 * @swagger
 * /teacher/assignments:
 *   post:
 *     summary: Create a new assignment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Assignment created successfully
 */
// Route to view specific assignment details
router.get('/assignments/:id', teacherController.viewAssignment);
router.post('/assignments', fileController.upload, teacherController.createAssignmentPost);
// teacher.js (routes)

router.get('/viewaSubmissions', teacherController.viewStudentSubmissions);

// Route to handle grading submission
router.post('/gradeSubmission/:submissionId', teacherController.gradeSubmission);

// Route to view the scoreboard
router.get('/scoreboard', teacherController.viewScoreboard);

// Route to view enrolled students for quizzes
router.get('/enrolledStudents', teacherController.viewEnrolledStudents);

// In routes/teacher.js
router.post('/gradeQuiz/:quizId/:studentId', teacherController.gradeQuiz);




/**
 * @swagger
 * /teacher/assignments/{id}/grade:
 *   post:
 *     summary: Grade an assignment
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the assignment to grade
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               grade:
 *                 type: number
 *     responses:
 *       200:
 *         description: Assignment graded successfully
 *       404:
 *         description: Assignment not found
 */
router.post('/assignments/:id/grade', teacherController.gradeAssignmentPost);

/**
 * @swagger
 * /teacher/upload:
 *   get:
 *     summary: Render the file upload form
 *     responses:
 *       200:
 *         description: Render upload form
 */
router.get('/upload', teacherController.renderUploadForm);

/**
 * @swagger
 * /teacher/upload:
 *   post:
 *     summary: Upload a file
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: File uploaded successfully
 */
router.post('/upload', fileController.upload, teacherController.uploadFilePost);

/**
 * @swagger
 * /teacher/viewContent:
 *   get:
 *     summary: View uploaded files
 *     responses:
 *       200:
 *         description: Render uploaded files
 */
router.get('/viewContent', teacherController.viewUploadedFiles);

/**
 * @swagger
 * /teacher/courses/{id}/students:
 *   get:
 *     summary: View enrolled students for a specific course
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the course to retrieve enrolled students
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of enrolled students retrieved successfully
 *       404:
 *         description: Course not found
 */
//router.get('/courses/:id/students', teacherController.viewEnrolledStudents);

// Notification Routes
router.get('/notifications', teacherController.viewNotifications);
router.post('/notifications/send', teacherController.sendNotification);
// Route to view replies
router.get('/viewreplies', teacherController.viewReplies);



// In your teacher.js routes file

// Assignment Routes
router.get('/assignments', teacherController.viewAssignments); // View all assignments
router.get('/createAssignment', teacherController.renderCreateAssignmentForm); // Render create assignment form

router.get('/assignments/:id', teacherController.viewAssignment); // View a specific assignment
// Route to view student submissions for a specific assignment
router.get('/assignments/:assignmentId/submissions', teacherController.viewStudentSubmissions);

router.post('/assignments/:id/grade', teacherController.gradeAssignmentPost); // Grade an assignment

// Route to display the report generation page
router.get('/report', teacherController.renderReportPage);


// Route to generate the PDF report
// Route to generate report for a specific student
router.get('/report/generate', teacherController.generateStudentReport);
//gor pdf gen




module.exports = router;
