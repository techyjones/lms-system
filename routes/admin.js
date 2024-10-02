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
/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin-related operations
 */

/**
 * @swagger
 * /admin:
 *   get:
 *     summary: Admin dashboard
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Admin dashboard rendered successfully.
 *       500:
 *         description: Internal server error.
 */
router.get('/', adminController.dashboard);

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Manage users
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Successfully retrieved users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error.
 */
router.get('/users', adminController.manageUsers);

/**
 * @swagger
 * /admin/config:
 *   get:
 *     summary: Admin configuration page
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Configuration page rendered successfully.
 *       500:
 *         description: Internal server error.
 */
router.get('/config', adminController.config);

/**
 * @swagger
 * /admin/manage:
 *   get:
 *     summary: Manage courses, quizzes, and assignments
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Successfully retrieved content.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 courses:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Course'
 *                 quizzes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Quiz'
 *                 assignments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Assignment'
 *       500:
 *         description: Internal server error.
 */
router.get('/manage', adminController.manageContent);

/**
 * @swagger
 * /admin/courses/{id}/edit:
 *   get:
 *     summary: Edit a course by ID
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The course ID
 *     responses:
 *       200:
 *         description: Course edit form rendered successfully.
 *       404:
 *         description: Course not found.
 *       500:
 *         description: Internal server error.
 */
router.get('/courses/:id/edit', adminController.editCourse);

/**
 * @swagger
 * /admin/courses/{id}/edit:
 *   post:
 *     summary: Update a course by ID
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The course ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The course title
 *               description:
 *                 type: string
 *                 description: The course description
 *     responses:
 *       200:
 *         description: Course updated successfully.
 *       404:
 *         description: Course not found.
 *       500:
 *         description: Internal server error.
 */
router.post('/courses/:id/edit', adminController.updateCourse);

/**
 * @swagger
 * /admin/users/{id}/edit:
 *   get:
 *     summary: Edit a user by ID
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User edit form rendered successfully.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
router.get('/users/:id/edit', adminController.editUser);

module.exports = router;
