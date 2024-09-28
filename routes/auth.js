// routes/auth.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Registration routes
router.get('/register', authController.registerGet);
router.post('/register', authController.registerPost);

// Login routes
router.get('/login', authController.loginGet);
router.post('/login', authController.loginPost);

// Logout route
router.get('/logout', authController.logoutGet);

module.exports = router;
