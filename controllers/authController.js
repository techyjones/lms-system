const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer'); 
const flash = require('connect-flash');
const crypto = require('crypto'); 

// Helper function to send OTP via email
const sendOTP = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail', 
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS  
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset OTP',
    text: `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`
  };

  await transporter.sendMail(mailOptions);
};

// Register
exports.registerGet = (req, res) => {
  res.render('auth/register');
};

exports.registerPost = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      req.flash('error', 'Username already exists');
      return res.redirect('/auth/register');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword, role });
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

      // Create JWT token
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // Token expiration time
      );

      
      res.cookie('token', token, { httpOnly: true, secure: false }); // secure: true for HTTPS

      // Redirect based on role
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

// Forgot Password - Request OTP
exports.forgotPasswordGet = (req, res) => {
  res.render('auth/forgotPassword');
};

exports.forgotPasswordPost = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      req.flash('error', 'Email not found');
      return res.redirect('/auth/forgotPassword');
    }

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString(); 
    const otpExpires = Date.now() + 10 * 60 * 1000; 

    // Save OTP and expiration to the user model
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send OTP to user's email
    await sendOTP(email, otp);

    req.flash('success', 'OTP has been sent to your email.');
    res.redirect('/auth/verifyOtp');
  } catch (error) {
    req.flash('error', 'Error sending OTP. Please try again.');
    res.redirect('/auth/forgotPassword');
  }
};

// Verify OTP
exports.verifyOtpGet = (req, res) => {
  res.render('auth/verifyOtp');
};

exports.verifyOtpPost = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
      req.flash('error', 'Invalid or expired OTP');
      return res.redirect('/auth/verifyOtp');
    }

    // OTP is valid, redirect to reset password
    req.flash('success', 'OTP verified. Please reset your password.');
    res.redirect(`/auth/resetPassword?email=${email}`);
  } catch (error) {
    req.flash('error', 'OTP verification failed. Please try again.');
    res.redirect('/auth/verifyOtp');
  }
};

// Reset Password - Render Reset Form
exports.resetPasswordGet = (req, res) => {
  const { email } = req.query;
  res.render('auth/resetPassword', { email });
};

// Reset Password - Handle Reset
exports.resetPasswordPost = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      req.flash('error', 'Email not found');
      return res.redirect('/auth/resetPassword');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.otp = undefined; 
    user.otpExpires = undefined; 
    await user.save();

    req.flash('success', 'Password reset successful. Please log in.');
    res.redirect('/auth/login');
  } catch (error) {
    req.flash('error', 'Password reset failed. Please try again.');
    res.redirect('/auth/resetPassword');
  }
};

// Logout
exports.logout = (req, res) => {
  res.clearCookie('token');
  req.flash('success', 'Logged out successfully.');
  res.redirect('/');
};

// Middleware to protect routes
exports.protect = (role) => {
  return (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
      req.flash('error', 'You must be logged in to access this page.');
      return res.redirect('/auth/login');
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      // Check if user has the required role
      if (role && req.user.role !== role) {
        req.flash('error', 'You are not authorized to access this page.');
        return res.redirect('/auth/login');
      }

      next();
    } catch (err) {
      req.flash('error', 'Session expired or invalid. Please log in again.');
      res.redirect('/auth/login');
    }
  };
};
