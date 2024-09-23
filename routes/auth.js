const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication management
 */

/**
 * @swagger
 * /register:
 *   get:
 *     summary: Render register page
 *     tags: [Auth]
 *   post:
 *     summary: Handle user registration
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *             required:
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 *       409:
 *         description: User already exists
 */

/**
 * @swagger
 * /login:
 *   get:
 *     summary: Render login page
 *     tags: [Auth]
 *   post:
 *     summary: Handle user login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Handle user logout
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User logged out successfully
 */

/**
 * @swagger
 * /forgotPassword:
 *   get:
 *     summary: Render forgot password page
 *     tags: [Auth]
 *   post:
 *     summary: Handle forgot password logic and send OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: OTP sent to email
 *       404:
 *         description: Email not found
 */

/**
 * @swagger
 * /verifyOtp:
 *   get:
 *     summary: Render OTP verification page
 *     tags: [Auth]
 *   post:
 *     summary: Handle OTP verification
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               otp:
 *                 type: string
 *             required:
 *               - otp
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Invalid OTP
 */

/**
 * @swagger
 * /reset-password:
 *   get:
 *     summary: Render reset password page after OTP verification
 *     tags: [Auth]
 *   post:
 *     summary: Handle password reset after OTP verification
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *                 format: password
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *             required:
 *               - newPassword
 *               - confirmPassword
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Bad request
 *       409:
 *         description: Passwords do not match
 */

// Registration Routes
router.get('/register', authController.registerGet); // Render register page
router.post('/register', authController.registerPost); // Handle registration

// Login Routes
router.get('/login', authController.loginGet); // Render login page
router.post('/login', authController.loginPost); // Handle login

// Logout Route
router.get('/logout', authController.logout); // Handle logout

// Forgot Password Routes
router.get('/forgotPassword', authController.forgotPasswordGet); // Render forgot password page
router.post('/forgotPassword', authController.forgotPasswordPost); // Handle forgot password logic and send OTP

// OTP Verification Routes
router.get('/verifyOtp', authController.verifyOtpGet); // Render OTP verification page
router.post('/verifyOtp', authController.verifyOtpPost); // Handle OTP verification

// Reset Password Routes
router.get('/reset-password', authController.resetPasswordGet); // Render reset password page after OTP verification
router.post('/reset-password', authController.resetPasswordPost); // Handle password reset after OTP verification

module.exports = router;
