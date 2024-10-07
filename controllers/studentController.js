const Course = require('../models/Course');
const Assignment = require('../models/Assignment');
const File = require('../models/fileModel'); 
const User = require('../models/User');
const Reply = require('../models/reply');
const Quiz = require('../models/Quiz');
const StudentQuiz = require('../models/StudentQuiz');
const Notification = require('../models/notification');

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
// Render available quizzes for a student to attend
exports.viewExistingQuizzes = async (req, res) => {
  try {
    // Fetch all quizzes and populate the associated course's name field
    const quizzes = await Quiz.find().populate('courseId', 'name').exec();
    
    // Render the EJS view and pass the quizzes data
    res.render('student/viewExistingQuizzes', { quizzes });
  } catch (err) {
    console.error('Error fetching quizzes:', err); // Log the error for debugging
    res.status(500).send('Server Error');
  }
};


// Render quiz page for a student
exports.renderQuizPage = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId).populate('courseId', 'name');
    res.render('student/attendQuiz', { quiz });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};



// Handle quiz submission and calculate the result
exports.submitQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    const { answers } = req.body;

    let score = 0;
    quiz.questions.forEach((question, index) => {
      if (question.correctAnswer === answers[index]) {
        score++;
      }
    });

    const totalQuestions = quiz.questions.length;
    const percentageScore = (score / totalQuestions) * 100;

    // You can save the score to the student's record or return it directly
    res.render('student/quizResult', { score, totalQuestions, percentageScore });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};



exports.viewAssignments = async (req, res) => {
  const assignments = await Assignment.find(); 
  res.render('student/assignments', { assignments });
};


// Student Controller
exports.viewGrades = async (req, res) => {
  try {
    const studentId = req.session.user._id; // Get the logged-in student ID

    // Fetch assignment grades for the student
    const assignmentGrades = await StudentSubmission.find({ studentId })
      .populate('assignmentId', 'title') // Populate assignment title
      .select('assignmentId grade'); 

    // Fetch quiz grades for the student
    const quizGrades = await StudentQuiz.find({ studentId })
      .populate('quizId', 'title') 
      .select('quizId grade'); 

    if (assignmentGrades.length === 0 && quizGrades.length === 0) {
      return res.render('student/grades', {
        assignmentGrades: [],
        quizGrades: [],
        message: 'No grades available yet.'
      });
    }

    // Render the view with the fetched grades
    res.render('student/grades', {
      assignmentGrades,
      quizGrades,
      message: null
    });
  } catch (error) {
    console.error('Error fetching grades:', error);
    res.status(500).render('student/grades', { 
      assignmentGrades: [], 
      quizGrades: [], 
      message: 'An error occurred while fetching your grades. Please try again later.' 
    });
  }
};



exports.viewMaterials = async (req, res) => {
  const files = await File.find({ category: 'material' }); 
  res.render('student/materials', { files });
};


// View notifications for a student
exports.viewStudentNotifications = async (req, res) => {
  try {
      const studentId = req.session.user._id; // Get the logged-in student's ID
      const notifications = await Notification.find({ student: studentId }).populate('teacher', 'username');

      // Check if there are no notifications and provide a message
      if (notifications.length === 0) {
          return res.render('student/notifications', { notifications: [], message: "No notifications yet." });
      }

      // Render the notifications with the retrieved data
      res.render('student/notifications', { notifications, message: null });
  } catch (err) {
      console.error('Error fetching notifications:', err);
      res.status(500).send('An error occurred while fetching your notifications.');
  }
};


// Respond to a notification
exports.respondToNotification = async (req, res) => {
  try {
      const { notificationId } = req.params; 
      const { reply } = req.body; 

      // Create a new reply document
      const replyDoc = new Reply({
          notification: notificationId, // Link to the notification
          student: req.session.user._id, // Logged-in student's ID
          replyMessage: reply 
      });

      // Save the reply to the database
      await replyDoc.save();


      res.redirect('/student/notifications'); // Redirect to notifications page
  } catch (err) {
      console.error('Error responding to notification:', err);
      res.status(500).send('An error occurred while responding to the notification.');
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