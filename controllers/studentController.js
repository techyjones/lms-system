const Course = require('../models/Course');
const Assignment = require('../models/Assignment');
const File = require('../models/fileModel'); 
const User = require('../models/User');
const Reply = require('../models/reply');

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
    const quizzes = await Quiz.find({}).populate('courseId');
    res.render('student/quizzes', { quizzes });
  } catch (error) {
    res.status(500).send("Error viewing quizzes.");
  }
};

// Enroll in Quiz
exports.enrollInQuiz = async (req, res) => {
  try {
    const quizId = req.params.id;
    const student = await Student.findById(req.session.user._id);
    
    if (!student.quizzes.includes(quizId)) {
      student.quizzes.push(quizId);
      await student.save();
    }

    res.redirect('/student/quizzes');
  } catch (error) {
    res.status(500).send("Error enrolling in quiz.");
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