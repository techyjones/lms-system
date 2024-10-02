
const twilio = require('twilio');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const twilioService = require('../services/twilioService');

exports.registerGet = (req, res) => {
  res.render('register');
};

exports.registerPost = async (req, res) => {
  const { username, email, password, role, mobile } = req.body;  // Added 'email'

  try {
    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      req.flash('error', 'Username already exists');
      return res.redirect('/auth/register');
    }

    // Check if mobile number already exists
    const existingMobile = await User.findOne({ mobile });
    if (existingMobile) {
      req.flash('error', 'Mobile number already in use');
      return res.redirect('/auth/register');
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      req.flash('error', 'Email already in use');
      return res.redirect('/auth/register');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with mobile number and email
    const newUser = new User({
      username,
      email,  // Added 'email' to the new user data
      password: hashedPassword,
      role,
      mobile
    });

    // Save the user
    await newUser.save();
    req.flash('success', 'Registration successful. Please log in.');
    res.redirect('/auth/login');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Registration failed. Please try again.');
    res.redirect('/auth/register');
  }
};



exports.loginGet = (req, res) => {
  res.render('login');
};

exports.loginPost = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
      req.session.user = user;

      // Send SMS notification
     // const message = 'Login successful!';
     // await twilioService.sendSMS(user.mobile, message); // Sending SMS to the user's mobile

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

exports.logoutGet = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      req.flash('error', 'Logout failed. Please try again.');
      return res.redirect('/');
    }
    res.redirect('/');
  });
};
