// routes/auth.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Example of protecting a route
router.get('/dashboard', authenticateToken, (req, res) => {
    res.send('Welcome to the Dashboard');
});



/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication related APIs
 */

/**
 * @swagger
 * /auth/register:
 *   get:
 *     summary: Render the registration page
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Render the registration form
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username for the new user
 *               email:
 *                 type: string
 *                 description: The email address for the new user
 *               password:
 *                 type: string
 *                 description: The password for the new user
 *               role:
 *                 type: string
 *                 description: The role of the new user (e.g., student, teacher)
 *               mobile:
 *                 type: string
 *                 description: The mobile number for the new user
 *     responses:
 *       302:
 *         description: Registration successful, redirect to login
 *       400:
 *         description: Registration failed due to validation errors
 */

/**
 * @swagger
 * /auth/login:
 *   get:
 *     summary: Render the login page
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Render the login form
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in an existing user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user
 *               password:
 *                 type: string
 *                 description: The password of the user
 *     responses:
 *       302:
 *         description: Login successful, redirect to user role dashboard
 *       401:
 *         description: Invalid username or password
 */

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Log out the current user
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Logout successful, redirect to home page
 */


// Registration routes
router.get('/register', authController.registerGet);
router.post('/register', authController.registerPost);

// Login routes
router.get('/login', authController.loginGet);
router.post('/login', authController.loginPost);

// Logout route
router.get('/logout', authController.logoutGet);

// Forget Password Routes
router.get('/forgetPassword', authController.forgetPasswordGet);
router.post('/forgetPassword', authController.forgetPasswordPost);

// Reset Password Routes
router.get('/resetPassword/:userId', authController.resetPasswordGet);
router.post('/resetPassword/:userId', authController.resetPasswordPost);

module.exports = router;
