const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');


router.get('/login', (req, res) => {
    res.render('login');
});


router.post('/login', authController.login);


router.get('/register', (req, res) => {
    res.render('register');
});


router.post('/register', authController.register);


router.get('/dashboard/student', auth, (req, res) => {
    if (req.user.role !== 'student') return res.status(403).send('Access denied');
    res.render('studentDashboard', { username: req.user.username });
});

router.get('/dashboard/teacher', auth, (req, res) => {
    if (req.user.role !== 'teacher') return res.status(403).send('Access denied');
    res.render('teacherDashboard', { username: req.user.username });
});

router.get('/dashboard/admin', auth, (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).send('Access denied');
    res.render('adminDashboard', { username: req.user.username });
});

module.exports = router;
