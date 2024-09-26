const Course = require('../models/Course');
const Assignment = require('../models/Assignment');
const File = require('../models/fileModel'); 
const User = require('../models/User');
const Reply = require('../models/reply');
const Quiz = require('../models/Quiz');

const StudentSubmission = require('../models/StudentSubmission');

exports.dashboard = (req, res) => {
  res.render('student/dashboard');
};


exports.viewCourses = async (req, res) => {
  const courses = await Course.find();
  res.render('student/courses', { courses });
};


exports.enrollCourse = async (req, res) => {
  const courseId = req.params.id;
  const userId = req.session.user._id; 
  try {
    
    const course = await Course.findById(courseId);
    const student = await User.findById(userId);

    if (!course) {
      req.flash('error', 'Course not found');
      return res.redirect('/student/courses');
    }

    
    if (student.enrolledCourses && student.enrolledCourses.includes(courseId)) {
      req.flash('error', 'You are already enrolled in this course');
      return res.redirect('/student/courses');
    }

    
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

// View Available Quizzes
exports.viewAvailableQuizzes = async (req, res) => {
  try {
    // Fetch quizzes and populate course details
    const quizzes = await Quiz.find().populate('courseId').exec();
 // Use 'course' if that's the field name

    // Render the EJS template with quizzes
    res.render('student/studentQuizzes', { quizzes });
  } catch (error) {
    console.error('Error viewing quizzes:', error);
    res.status(500).send("Error viewing quizzes.");
  }
};

// Enroll in Quiz
// Enroll in Quiz
exports.enrollInQuiz = async (req, res) => {
  try {
    const quizId = req.params.id;
    
    // Find the student by ID
    const student = await User.findById(req.session.user._id);
    
    // Check if the student exists
    if (!student) {
      return res.status(404).send('Student not found');
    }
    
    // Check if the student is already enrolled
    if (!student.quizzes.includes(quizId)) {
      student.quizzes.push(quizId);
      await student.save();
    }

    res.redirect('/student/studentQuizzes');
  } catch (error) {
    console.error('Error enrolling in quiz:', error); // Log the error for debugging
    res.status(500).send('Error enrolling in quiz.');
  }
};


exports.viewAssignments = async (req, res) => {
  const assignments = await Assignment.find(); 
  res.render('student/assignments', { assignments });
};


exports.viewGrades = (req, res) => {
  
  res.render('student/grades');
};


exports.viewMaterials = async (req, res) => {
  const files = await File.find({ category: 'material' }); 
  res.render('student/materials', { files });
};


// View notifications for the student
exports.viewNotifications = async (req, res) => {
  try {
      const notifications = await Notification.find({ student: req.session.user._id });
      res.render('student/notifications', { notifications });
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
};

// Reply to a notification
exports.replyNotification = async (req, res) => {
  try {
      const { replyMessage } = req.body;
      const notificationId = req.params.id;

      const reply = new Reply({
          notification: notificationId,
          student: req.session.user._id,
          replyMessage
      });

      await reply.save();
      res.redirect('/student/notifications');
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
};

// View Assignments
exports.viewAssignments = async (req, res) => {
  const assignments = await Assignment.find(); 
  res.render('student/viewAssignments', { assignments });
};

// Submit Assignment
exports.submitAssignmentPost = async (req, res) => {
  const { assignmentId } = req.params;
  const file = req.file; 

  const submission = new StudentSubmission({
    assignmentId,
    studentId: req.session.user._id, 
    fileUrl: file.path 
  });

  await submission.save();
  res.redirect('/student/assignments'); 
};

// View Submission Status
exports.viewSubmissionStatus = async (req, res) => {
  const submissions = await StudentSubmission.find({ studentId: req.session.user._id });
  res.render('student/viewSubmissionStatus', { submissions });
};