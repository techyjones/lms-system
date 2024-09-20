const Course = require('../models/Course');
const Assignment = require('../models/Assignment');
const File = require('../models/fileModel'); 
const User = require('../models/User');

// Dashboard
exports.dashboard = (req, res) => {
  res.render('student/dashboard');
};

// View Courses
exports.viewCourses = async (req, res) => {
  const courses = await Course.find();
  res.render('student/courses', { courses });
};

// Enroll in Course
exports.enrollCourse = async (req, res) => {
  const courseId = req.params.id;
  const userId = req.session.user._id; 
  try {
    // Find the course and the student
    const course = await Course.findById(courseId);
    const student = await User.findById(userId);

    if (!course) {
      req.flash('error', 'Course not found');
      return res.redirect('/student/courses');
    }

    // Check if the student is already enrolled
    if (student.enrolledCourses && student.enrolledCourses.includes(courseId)) {
      req.flash('error', 'You are already enrolled in this course');
      return res.redirect('/student/courses');
    }

    // Enroll the student in the course
    student.enrolledCourses.push(courseId);
    await student.save();

    req.flash('success', 'Successfully enrolled in the course');
    res.redirect('/student/courses');
  } catch (error) {
    console.error(error);
    req.flash('error', 'An error occurred while enrolling in the course');
    res.redirect('/student/courses');
  }
};

// View Assignments
exports.viewAssignments = async (req, res) => {
  const assignments = await Assignment.find(); 
  res.render('student/assignments', { assignments });
};

// View Grades
exports.viewGrades = (req, res) => {
  
  res.render('student/grades');
};

// View Educational Materials
exports.viewMaterials = async (req, res) => {
  const files = await File.find({ category: 'material' }); 
  res.render('student/materials', { files });
};
