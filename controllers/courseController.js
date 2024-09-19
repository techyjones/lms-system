const Course = require('../models/Course');

// View all courses
exports.viewAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.render('courses/viewAllCourses', { courses });
  } catch (error) {
    req.flash('error', 'Failed to load courses.');
    res.redirect('/');
  }
};

// Create a new course
exports.createCourse = async (req, res) => {
  const { title, description } = req.body;
  try {
    const newCourse = new Course({ title, description, teacher: req.session.user._id });
    await newCourse.save();
    req.flash('success', 'Course created successfully.');
    res.redirect('/courses');
  } catch (error) {
    req.flash('error', 'Failed to create course.');
    res.redirect('/courses');
  }
};

// View course details
exports.viewCourseDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const course = await Course.findById(id);
    if (!course) {
      req.flash('error', 'Course not found.');
      return res.redirect('/courses');
    }
    res.render('courses/viewCourseDetails', { course });
  } catch (error) {
    req.flash('error', 'Failed to load course details.');
    res.redirect('/courses');
  }
};

// Update a course
exports.updateCourse = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  try {
    await Course.findByIdAndUpdate(id, { title, description });
    req.flash('success', 'Course updated successfully.');
    res.redirect('/courses');
  } catch (error) {
    req.flash('error', 'Failed to update course.');
    res.redirect('/courses');
  }
};

// Delete a course
exports.deleteCourse = async (req, res) => {
  const { id } = req.params;
  try {
    await Course.findByIdAndDelete(id);
    req.flash('success', 'Course deleted successfully.');
    res.redirect('/courses');
  } catch (error) {
    req.flash('error', 'Failed to delete course.');
    res.redirect('/courses');
  }
};
