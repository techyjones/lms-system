const User = require('../models/User');
const Course = require('../models/Course');
const Quiz = require('../models/Quiz');
const Assignment = require('../models/Assignment');




exports.dashboard = (req, res) => {
  res.render('admin/dashboard');
};


exports.manageUsers = async (req, res) => {
  const users = await User.find();
  res.render('admin/users', { users });
};


exports.config = (req, res) => {
  res.render('admin/config');
};


exports.manageContent = async (req, res) => {
  const courses = await Course.find();
  const quizzes = await Quiz.find();
  const assignments = await Assignment.find();
  res.render('admin/manage', { courses, quizzes, assignments });
};


exports.editCourse = async (req, res) => {
  const { id } = req.params;
  try {
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).send('Course not found.');
    }
    // Pass messages to the view
    res.render('admin/editCourse', { course, messages: req.flash() });
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).send('Server error');
  }
};


exports.updateCourse = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body; // Ensure you validate this data as necessary
  try {
    await Course.findByIdAndUpdate(id, updatedData);
    req.flash('success', 'Course updated successfully!');
    res.redirect('/admin/courses'); // Redirect to the courses list after update
  } catch (error) {
    console.error('Error updating course:', error);
    req.flash('error', 'Failed to update course.');
    res.redirect(`/admin/courses/${id}/edit`); // Redirect back to the edit page on error
  }
};

exports.editUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send('User not found.');
    }
    res.render('admin/editUser', { user, messages: req.flash() });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).send('Server error');
  }
};