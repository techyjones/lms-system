const Course = require('../models/Course');
const Quiz = require('../models/Quiz');
const Assignment = require('../models/Assignment');
const File = require('../models/fileModel'); 
const User = require('../models/User'); 
const Notification = require('../models/notification');


// Dashboard
exports.dashboard = (req, res) => {
  res.render('teacher/dashboard');
};



exports.renderCreateCourseForm = (req, res) => {
  res.render('teacher/createCourse'); 
};


exports.createCoursePost = async (req, res) => {
  const { title, description } = req.body;
  const newCourse = new Course({ title, description, teacher: req.session.user._id });
  await newCourse.save();
  res.redirect('/teacher/courses');
};


exports.viewCourses = async (req, res) => {
  const courses = await Course.find({ teacher: req.session.user._id });
  res.render('teacher/courses', { courses });
};


// Create Quiz (GET form)
exports.renderCreateQuizForm = async (req, res) => {
  try {
    const courses = await Course.find(); // Fetch all courses
    console.log(courses); // Log the courses to see if they're fetched correctly
    res.render('teacher/createQuiz', { courses }); // Pass courses to the view
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

// Create Quiz (POST)
exports.createQuizPost = async (req, res) => {
  try {
    const { title, courseId, questions, options, answers } = req.body;

    const quizData = {
      title,
      courseId,
      questions: questions.map((question, index) => ({
        questionText: question,
        options: options[index],
        correctAnswer: answers[index]
      }))
    };

    const quiz = new Quiz(quizData);
    await quiz.save();
    res.redirect('/teacher/quizzes');
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// View Quizzes
exports.viewQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate('courseId', 'name'); // Populate with course name
    res.render('teacher/quizzes', { quizzes });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// Render Edit Quiz Form
exports.renderEditQuizForm = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    const courses = await Course.find();
    res.render('teacher/editQuiz', { quiz, courses });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// Update Quiz
exports.updateQuizPost = async (req, res) => {
  try {
    const { title, courseId, questions, options, answers } = req.body;
    const updatedQuiz = {
      title,
      courseId,
      questions: questions.map((question, index) => ({
        questionText: question,
        options: options[index],
        correctAnswer: answers[index]
      }))
    };

    await Quiz.findByIdAndUpdate(req.params.id, updatedQuiz);
    res.redirect('/teacher/quizzes');
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// Delete Quiz
exports.deleteQuizPost = async (req, res) => {
  try {
    await Quiz.findByIdAndDelete(req.params.id);
    res.redirect('/teacher/quizzes');
  } catch (err) {
    res.status(500).send('Server Error');
  }
};


exports.createAssignmentPost = async (req, res) => {
  const { title, description, courseId } = req.body;
  const newAssignment = new Assignment({ title, description, course: courseId });
  await newAssignment.save();
  res.redirect('/teacher/assignments');
};


exports.viewAssignments = async (req, res) => {
  const courses = await Course.find({ teacher: req.session.user._id });
  const assignments = await Assignment.find({ course: { $in: courses.map(c => c._id) } });
  res.render('teacher/assignments', { assignments });
};


exports.gradeAssignmentPost = async (req, res) => {
  const { studentId, grade } = req.body;
  await Assignment.findByIdAndUpdate(req.params.id, {
    $push: { submissions: { student: studentId, grade } }
  });
  res.redirect('/teacher/assignments');
};


exports.viewEnrolledStudents = async (req, res) => {
  const courseId = req.params.id;

  try {
   
    const course = await Course.findById(courseId).populate('students').exec();

    if (!course) {
      req.flash('error', 'Course not found');
      return res.redirect('/teacher/courses');
    }

    
    res.render('teacher/enrolledStudents', { course, students: course.students });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error fetching students');
    res.redirect('/teacher/courses');
  }
};


exports.renderEditCourseForm = async (req, res) => {
  const { id } = req.params;
  try {
    const course = await Course.findById(id);
    if (!course) {
      req.flash('error', 'Course not found.');
      return res.redirect('/teacher/courses');
    }
    res.render('teacher/editCourse', { course });
  } catch (error) {
    req.flash('error', 'Failed to load course.');
    res.redirect('/teacher/courses');
  }
};

exports.updateCourse = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  try {
    await Course.findByIdAndUpdate(id, { title, description });
    req.flash('success', 'Course updated successfully.');
    res.redirect('/teacher/courses');
  } catch (error) {
    req.flash('error', 'Failed to update course.');
    res.redirect('/teacher/courses');
  }
};

exports.deleteCourse = async (req, res) => {
  const { id } = req.params;
  try {
    await Course.findByIdAndDelete(id);
    req.flash('success', 'Course deleted successfully.');
    res.redirect('/teacher/courses');
  } catch (error) {
    req.flash('error', 'Failed to delete course.');
    res.redirect('/teacher/courses');
  }
};



exports.renderUploadForm = (req, res) => {
  res.render('teacher/upload'); 
};


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


exports.viewUploadedFiles = async (req, res) => {
  try {
    const files = await File.find(); 
    res.render('teacher/viewContent', { files, messages: req.flash() });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};



// View notifications page (where teacher can send notifications)
exports.viewNotifications = async (req, res) => {
    try {
        const students = await User.find({ role: 'student' });
        res.render('teacher/notifications', { students });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Send notification to a student
exports.sendNotification = async (req, res) => {
    try {
        const { studentId, message } = req.body;
        const notification = new Notification({
            teacher: req.session.user._id,
            student: studentId,
            message: message
        });
        await notification.save();
        res.redirect('/teacher/notifications');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.viewReplies = async (req, res) => {
  try {
      const replies = await Reply.find({ notification: req.params.notificationId })
                                 .populate('student', 'name');
      res.render('teacher/viewReplies', { replies });
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
};

