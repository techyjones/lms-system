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
// Route to view quizzes
router.get('/viewQuizzes', teacherController.viewQuizzes);  // This should exist

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
 * /teacher/assignments/{id}:
 *   get:
 *     summary: View specific assignment details
 *     tags:
 *       - Teacher
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The assignment ID
 *     responses:
 *       200:
 *         description: Successful response with assignment details
 *       404:
 *         description: Assignment not found
 */
router.get('/assignments/:id', teacherController.viewAssignment);

/**
 * @swagger
 * /teacher/assignments:
 *   post:
 *     summary: Create a new assignment
 *     tags:
 *       - Teacher
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
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Assignment created successfully
 *       400:
 *         description: Bad request
 */
router.post('/assignments', fileController.upload, teacherController.createAssignmentPost);

/**
 * @swagger
 * /teacher/viewaSubmissions:
 *   get:
 *     summary: View all student submissions
 *     tags:
 *       - Teacher
 *     responses:
 *       200:
 *         description: Successful response with student submissions
 */
router.get('/viewaSubmissions', teacherController.viewStudentSubmissions);

/**
 * @swagger
 * /teacher/gradeSubmission/{submissionId}:
 *   post:
 *     summary: Grade a specific assignment submission
 *     tags:
 *       - Teacher
 *     parameters:
 *       - in: path
 *         name: submissionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The submission ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               grade:
 *                 type: integer
 *                 description: Grade between 1 and 10
 *     responses:
 *       200:
 *         description: Submission graded successfully
 *       400:
 *         description: Invalid grade or submission ID
 */
router.post('/gradeSubmission/:submissionId', teacherController.gradeSubmission);

/**
 * @swagger
 * /teacher/scoreboard:
 *   get:
 *     summary: View the scoreboard for assignments
 *     tags:
 *       - Teacher
 *     responses:
 *       200:
 *         description: Successful response with the scoreboard
 */
router.get('/scoreboard', teacherController.viewScoreboard);

/**
 * @swagger
 * /teacher/enrolledStudents:
 *   get:
 *     summary: View students enrolled for quizzes
 *     tags:
 *       - Teacher
 *     responses:
 *       200:
 *         description: Successful response with a list of enrolled students
 */
router.get('/enrolledStudents', teacherController.viewEnrolledStudents);

/**
 * @swagger
 * /teacher/gradeQuiz/{quizId}/{studentId}:
 *   post:
 *     summary: Grade a specific quiz for a student
 *     tags:
 *       - Teacher
 *     parameters:
 *       - in: path
 *         name: quizId
 *         required: true
 *         schema:
 *           type: string
 *         description: The quiz ID
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The student ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               grade:
 *                 type: integer
 *                 description: Grade for the quiz
 *     responses:
 *       200:
 *         description: Quiz graded successfully
 *       400:
 *         description: Invalid quiz ID, student ID, or grade
 */
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
 * /teacher/notifications:
 *   get:
 *     summary: View all notifications sent to students
 *     tags:
 *       - Teacher
 *     responses:
 *       200:
 *         description: Successful response with a list of notifications
 */
router.get('/notifications', teacherController.viewNotifications);

/**
 * @swagger
 * /teacher/notifications/send:
 *   post:
 *     summary: Send a notification to a student
 *     tags:
 *       - Teacher
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 description: The content of the notification
 *               studentId:
 *                 type: string
 *                 description: The ID of the student
 *     responses:
 *       201:
 *         description: Notification sent successfully
 *       400:
 *         description: Invalid input or missing parameters
 */
router.post('/notifications/send', teacherController.sendNotification);

/**
 * @swagger
 * /teacher/viewreplies:
 *   get:
 *     summary: View replies from students to the notifications
 *     tags:
 *       - Teacher
 *     responses:
 *       200:
 *         description: Successful response with a list of replies
 */
router.get('/viewreplies', teacherController.viewReplies);





/**
 * @swagger
 * /teacher/assignments:
 *   get:
 *     summary: View all assignments
 *     tags:
 *       - Teacher
 *     responses:
 *       200:
 *         description: Successful response with a list of assignments
 */
router.get('/assignments', teacherController.viewAssignments);

/**
 * @swagger
 * /teacher/createAssignment:
 *   get:
 *     summary: Render the form to create a new assignment
 *     tags:
 *       - Teacher
 *     responses:
 *       200:
 *         description: Successful response with the assignment creation form
 */
router.get('/createAssignment', teacherController.renderCreateAssignmentForm);

/**
 * @swagger
 * /teacher/assignments/{id}:
 *   get:
 *     summary: View details of a specific assignment
 *     tags:
 *       - Teacher
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the assignment
 *     responses:
 *       200:
 *         description: Successful response with assignment details
 *       404:
 *         description: Assignment not found
 */
router.get('/assignments/:id', teacherController.viewAssignment);

/**
 * @swagger
 * /teacher/assignments/{assignmentId}/submissions:
 *   get:
 *     summary: View student submissions for a specific assignment
 *     tags:
 *       - Teacher
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the assignment
 *     responses:
 *       200:
 *         description: Successful response with student submissions
 *       404:
 *         description: Assignment not found
 */
router.get('/assignments/:assignmentId/submissions', teacherController.viewStudentSubmissions);

/**
 * @swagger
 * /teacher/assignments/{id}/grade:
 *   post:
 *     summary: Grade a specific assignment
 *     tags:
 *       - Teacher
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The assignment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               grade:
 *                 type: integer
 *                 description: The grade to assign to the submission
 *     responses:
 *       200:
 *         description: Assignment graded successfully
 *       400:
 *         description: Invalid assignment ID or grade
 */
router.post('/assignments/:id/grade', teacherController.gradeAssignmentPost);


/**
 * @swagger
 * /teacher/report:
 *   get:
 *     summary: Display the report generation page
 *     tags:
 *       - Teacher
 *     responses:
 *       200:
 *         description: Report generation page rendered successfully
 */
router.get('/report', teacherController.renderReportPage);

/**
 * @swagger
 * /teacher/report/generate:
 *   get:
 *     summary: Generate a PDF report for a specific student
 *     tags:
 *       - Teacher
 *     parameters:
 *       - in: query
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the student for which the report is generated
 *     responses:
 *       200:
 *         description: Report generated successfully
 *       404:
 *         description: Student not found
 */
router.get('/report/generate', teacherController.generateStudentReport);



module.exports = router;
