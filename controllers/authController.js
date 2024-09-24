const User = require('../models/User');
const bcrypt = require('bcryptjs');
const flash = require('connect-flash');

// Register
exports.registerGet = (req, res) => {
  res.render('auth/register');
};

exports.registerPost = async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      req.flash('error', 'Username already exists');
      return res.redirect('/auth/register');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, role });
    await newUser.save();
    req.flash('success', 'Registration successful. Please log in.');
    res.redirect('/auth/login');
  } catch (error) {
    req.flash('error', 'Registration failed. Please try again.');
    res.redirect('/auth/register');
  }
};

// Login
exports.loginGet = (req, res) => {
  res.render('auth/login');
};

exports.loginPost = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
      req.session.user = user;
      res.redirect(`/${user.role}`);
    } else {
      req.flash('error', 'Invalid username or password');
      res.redirect('/auth/login');
    }
  } catch (error) {
    req.flash('error', 'Login failed. Please try again.');
    res.redirect('/auth/login');
  }
};

// Logout
exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      req.flash('error', 'Logout failed. Please try again.');
      return res.redirect('/');
    }
    res.redirect('/');
  });
};