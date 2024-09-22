const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

/**
 * Middleware to check if user is authenticated
 */
router.use((req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/auth/login');
  }
});

/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Retrieve a list of all courses
 *     responses:
 *       200:
 *         description: A list of courses
 *       401:
 *         description: Unauthorized access
 */
router.get('/', courseController.viewAllCourses);

/**
 * @swagger
 * /courses/create:
 *   post:
 *     summary: Create a new course
 *     tags: 
 *       - Courses
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
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized access
 */
router.post('/create', courseController.createCourse);

/**
 * @swagger
 * /courses/{id}:
 *   get:
 *     summary: Get course details by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the course to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course details retrieved successfully
 *       404:
 *         description: Course not found
 *       401:
 *         description: Unauthorized access
 */
router.get('/:id', courseController.viewCourseDetails);

/**
 * @swagger
 * /courses/{id}:
 *   put:
 *     summary: Update a course by ID
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
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized access
 */
router.put('/:id', courseController.updateCourse);

/**
 * @swagger
 * /courses/{id}:
 *   delete:
 *     summary: Delete a course by ID
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
 *       401:
 *         description: Unauthorized access
 */
router.delete('/:id', courseController.deleteCourse);

module.exports = router;
