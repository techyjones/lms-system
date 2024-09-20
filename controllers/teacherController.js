const Course = require('../models/Course');
const Quiz = require('../models/Quiz');
const Assignment = require('../models/Assignment');
const File = require('../models/fileModel'); 
const User = require('../models/User'); 
// Dashboard
exports.dashboard = (req, res) => {
  res.render('teacher/dashboard');
};

// Render the Create Course form
exports.renderCreateCourseForm = (req, res) => {
  res.render('teacher/createCourse'); 
};

// Create Course
exports.createCoursePost = async (req, res) => {
  const { title, description } = req.body;
  const newCourse = new Course({ title, description, teacher: req.session.user._id });
  await newCourse.save();
  res.redirect('/teacher/courses');
};

// View Courses
exports.viewCourses = async (req, res) => {
  const courses = await Course.find({ teacher: req.session.user._id });
  res.render('teacher/courses', { courses });
};

// Create Quiz
exports.createQuizPost = async (req, res) => {
  const { title, courseId, questions } = req.body;
  const newQuiz = new Quiz({ title, course: courseId, questions });
  await newQuiz.save();
  res.redirect('/teacher/quizzes');
};

// View Quizzes
exports.viewQuizzes = async (req, res) => {
  const courses = await Course.find({ teacher: req.session.user._id });
  const quizzes = await Quiz.find({ course: { $in: courses.map(c => c._id) } });
  res.render('teacher/quizzes', { quizzes });
};

// Manage Assignments
exports.createAssignmentPost = async (req, res) => {
  const { title, description, courseId } = req.body;
  const newAssignment = new Assignment({ title, description, course: courseId });
  await newAssignment.save();
  res.redirect('/teacher/assignments');
};

// View Assignments
exports.viewAssignments = async (req, res) => {
  const courses = await Course.find({ teacher: req.session.user._id });
  const assignments = await Assignment.find({ course: { $in: courses.map(c => c._id) } });
  res.render('teacher/assignments', { assignments });
};

// Grade Assignments
exports.gradeAssignmentPost = async (req, res) => {
  const { studentId, grade } = req.body;
  await Assignment.findByIdAndUpdate(req.params.id, {
    $push: { submissions: { student: studentId, grade } }
  });
  res.redirect('/teacher/assignments');
};

// View Enrolled Students for a Course
exports.viewEnrolledStudents = async (req, res) => {
  const courseId = req.params.id;

  try {
   
    const course = await Course.findById(courseId).populate('students').exec();

    if (!course) {
      req.flash('error', 'Course not found');
      return res.redirect('/teacher/courses');
    }

    // Render the teacher dashboard with the list of students
    res.render('teacher/enrolledStudents', { course, students: course.students });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error fetching students');
    res.redirect('/teacher/courses');
  }
};

// File Upload - Render upload form
exports.renderUploadForm = (req, res) => {
  res.render('teacher/upload'); 
};

// File Upload - Handle file upload
exports.uploadFilePost = async (req, res) => {
  const { category } = req.body;
  const file = req.file;

  if (!file) {
    req.flash('error', 'No file uploaded.');
    return res.redirect('/teacher/upload');
  }

  const newFile = new File({
    originalName: file.originalname,
    filename: file.filename,
    path: file.path,
    size: file.size,
    mimetype: file.mimetype,
    uploadedBy: req.session.user._id,
    category
  });

  await newFile.save();
  req.flash('success', 'File uploaded successfully.');
  res.redirect('/teacher/upload');
};

// View uploaded files
exports.viewUploadedFiles = async (req, res) => {
  try {
    const files = await File.find(); 
    res.render('teacher/viewContent', { files, messages: req.flash() });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};
