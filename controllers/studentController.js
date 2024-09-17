const Course = require('../models/Course');
const Assignment = require('../models/Assignment');
const File = require('../models/fileModel'); 

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
  
  res.redirect('/student/courses');
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

// View  Materials
exports.viewMaterials = async (req, res) => {
  const files = await File.find({ category: 'material' }); 
  res.render('student/materials', { files });
};
