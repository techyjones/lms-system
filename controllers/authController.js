const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Register user
exports.register = async (req, res) => {
    const { username, email, password, role } = req.body;
    try {
        const user = new User({ username, email, password, role });
        await user.save();
        res.status(201).send('User registered successfully');
    } catch (error) {
        res.status(400).send(error.message);
    }
};

// Login user
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).send('Invalid email or password');

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).send('Invalid email or password');

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        // Set user role and redirect to the appropriate dashboard
        res.cookie('token', token, { httpOnly: true });

        if (user.role === 'student') {
            res.render('studentDashboard', { username: user.username });
        } else if (user.role === 'teacher') {
            res.render('teacherDashboard', { username: user.username });
        } else if (user.role === 'admin') {
            res.render('adminDashboard', { username: user.username });
        }
    } catch (error) {
        res.status(500).send('Server error');
    }
};
