
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
      email,  
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
      //await twilioService.sendSMS(user.mobile, message); // Sending SMS to the user's mobile

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


// Render Forget Password Page
exports.forgetPasswordGet = (req, res) => {
  res.render('auth/forgetPassword');
};

// Handle Forget Password Submission
exports.forgetPasswordPost = async (req, res) => {
  const { mobile } = req.body;
  
  try {
    // Find user by mobile number
    const user = await User.findOne({ mobile });
    if (!user) {
      req.flash('error', 'Mobile number not found');
      return res.redirect('/auth/forgetPassword');
    }

    // Generate OTP or a random reset code (optional)
    const resetCode = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP code
    user.resetCode = resetCode; // Save reset code in user model (or session)
    await user.save();
    
    // Send the reset code via SMS
    const message = `Your password reset code is: ${resetCode}`;
    await twilioService.sendSMS(mobile, message);

    req.flash('success', 'Password reset code sent to your mobile.');
    res.redirect(`/auth/resetPassword/${user._id}`);
  } catch (error) {
    console.error(error);
    req.flash('error', 'Something went wrong. Please try again.');
    res.redirect('/auth/forgetPassword');
  }
};

// Render Reset Password Page
exports.resetPasswordGet = (req, res) => {
  res.render('auth/resetPassword', { userId: req.params.userId });
};

// Handle Reset Password Submission
exports.resetPasswordPost = async (req, res) => {
  const { userId } = req.params;
  const { resetCode, newPassword } = req.body;

  try {
    // Find the user by userId
    const user = await User.findById(userId);
    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect(`/auth/resetPassword/${userId}`);
    }

    // Check if the reset code is valid and not expired
    const isCodeValid = user.resetCode === resetCode && user.resetPasswordExpires > Date.now();
    if (!isCodeValid) {
      req.flash('error', 'Invalid or expired reset code');
      return res.redirect(`/auth/resetPassword/${userId}`);
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetCode = null; // Clear the reset code after successful reset
    user.resetPasswordExpires = null; // Clear the expiration date
    await user.save();

    req.flash('success', 'Password has been reset. Please log in.');
    res.redirect('/auth/login');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Failed to reset password. Please try again.');
    res.redirect(`/auth/resetPassword/${userId}`);
  }
};