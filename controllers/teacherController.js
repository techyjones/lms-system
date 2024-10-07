const Course = require('../models/Course');
const Quiz = require('../models/Quiz');
const Assignment = require('../models/Assignment');
const File = require('../models/fileModel'); 
const User = require('../models/User'); 
const Notification = require('../models/notification');
const StudentSubmission = require('../models/StudentSubmission');
const StudentQuiz = require('../models/StudentQuiz');
const Reply = require('../models/reply');
//for pdf gen 
const { jsPDF } = require("jspdf"); // For PDF generation
const path = require("path");
const fs = require("fs");

exports.dashboard = async (req, res) => {
  try {
    // Fetch assignments here
    const assignments = await Assignment.find();

    // Fetch enrolled students
    const enrolledStudents = await User.find({
      $or: [
        { quizzes: { $exists: true, $ne: [] } }, // Students enrolled in quizzes
        { enrolledCourses: { $exists: true, $ne: [] } } // Students enrolled in courses
      ]
    });

    // Fetch total courses and quizzes
    const totalCourses = await Course.countDocuments(); // Total number of courses
    const totalQuizzes = await Quiz.countDocuments();   // Total number of quizzes

    // Prepare data for the chart
    const courseCounts = {}; // Object to count students per course
    const quizCounts = {};   // Object to count students per quiz

    enrolledStudents.forEach(student => {
      // Count enrolled courses
      student.enrolledCourses.forEach(course => {
        courseCounts[course] = (courseCounts[course] || 0) + 1;
      });

      // Count enrolled quizzes
      student.quizzes.forEach(quiz => {
        quizCounts[quiz] = (quizCounts[quiz] || 0) + 1;
      });
    });

    // Prepare chart data
    const chartData = {
      labels: [...new Set([...Object.keys(courseCounts), ...Object.keys(quizCounts), 'Total Courses', 'Total Quizzes'])], // Combine labels
      data: [
        ...Object.values(courseCounts),
        ...Object.values(quizCounts),
        totalCourses, // Add total courses to data
        totalQuizzes   // Add total quizzes to data
      ]
    };

    res.render('teacher/dashboard', { assignments, chartData }); // Pass assignments and chartData to the view
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).send('An error occurred while fetching dashboard data.');
  }
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
    const courses = await Course.find(); 
    console.log(courses); 
    res.render('teacher/createQuiz', { courses }); 
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
    res.redirect('/teacher/viewQuizzes');
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// View Quizzes
exports.viewQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate('courseId', 'name'); 
    res.render('teacher/viewQuizzes', { quizzes });
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
    res.redirect('/teacher/viewQuizzes');
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// In your teacherController.js
// Delete Quiz
exports.deleteQuizPost = async (req, res) => {
  try {
    const quizId = req.params.id;
    console.log(`Attempting to delete quiz with ID: ${quizId}`);

    const deletedQuiz = await Quiz.findByIdAndDelete(quizId);
    if (!deletedQuiz) {
      console.error(`Quiz not found with ID: ${quizId}`);
      return res.status(404).send('Quiz not found');
    }

    console.log(`Successfully deleted quiz: ${deletedQuiz.title}`);
    res.redirect('/teacher/viewQuizzes');
  } catch (err) {
    console.error('Error while deleting quiz:', err);
    res.status(500).send('Server Error');
  }
};



// Render Create Assignment Form
exports.renderCreateAssignmentForm = async (req, res) => {
  const courses = await Course.find();
  res.render('teacher/createAssignment', { courses });
};

// Create Assignment
exports.createAssignmentPost = async (req, res) => {
  const { title, courseId, dueDate } = req.body;
  const file = req.file; 

  // Create assignment entry in the database
  const assignment = new Assignment({
    title,
    courseId, 
    dueDate,
    fileUrl: file.path 
  });

  await assignment.save();
  res.redirect('/teacher/assignments');
};

// View Assignments
exports.viewAssignments = async (req, res) => {
  const assignments = await Assignment.find(); 
  res.render('teacher/assignments', { assignments });
};


// View Assignment Details
exports.viewAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id); 
    if (!assignment) {
      return res.status(404).send('Assignment not found'); 
    }
    res.render('teacher/viewAssignment', { assignment }); 
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

/// teacherController.js
exports.viewStudentSubmissions = async (req, res) => {
  try {
    // Find all submissions and populate student and assignment details
    const submissions = await StudentSubmission.find()
      .populate('studentId', 'username') 
      .populate('assignmentId', 'title'); 

    if (submissions.length === 0) {
      return res.status(404).send('No submissions found.');
    }

    res.render('teacher/viewaSubmissions', { submissions });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).send('An error occurred while fetching submissions. Please try again later.');
  }
};

// Grade submission
exports.gradeSubmission = async (req, res) => {
  try {
    const submissionId = req.params.submissionId;
    const { grade } = req.body;

    // Validate the grade (should be between 1 and 10)
    if (grade < 1 || grade > 10) {
      return res.status(400).send('Grade must be between 1 and 10.');
    }

    // Update the submission with the grade
    await StudentSubmission.findByIdAndUpdate(submissionId, { grade });

    res.redirect('/teacher/viewaSubmissions'); // Redirect back to submissions page
  } catch (error) {
    console.error('Error grading submission:', error);
    res.status(500).send('An error occurred while grading the submission.');
  }
};

// View Scoreboard
//exports.viewScoreboard = async (req, res) => {
  //try {
    // Fetch all submissions with populated student information
    //const submissions = await StudentSubmission.find()
      //.populate('studentId', 'username') // Populate with student username
      //.populate('assignmentId', 'title'); // Populate with assignment title

//    if (submissions.length === 0) {
  //    return res.status(404).send('No submissions found.');
    //}

   //res.render('teacher/scoreboard', { submissions });
 // } catch (error) {
  //  console.error('Error fetching scoreboard:', error);
 //   res.status(500).send('An error occurred while fetching the scoreboard. Please try again later.');
 // }
//};
// View Scoreboard
exports.viewScoreboard = async (req, res) => {
  try {
    // Fetch all assignment submissions with populated student and assignment information
    const assignmentSubmissions = await StudentSubmission.find()
      .populate('studentId', 'username') // Populate with student username
      .populate('assignmentId', 'title'); // Populate with assignment title

    // Fetch all quiz grades with populated student and quiz information
    const quizSubmissions = await StudentQuiz.find()
      .populate('studentId', 'username') // Populate with student username
      .populate('quizId', 'title'); // Populate with quiz title

    // If there are no submissions for either assignments or quizzes, handle the empty case
    if (assignmentSubmissions.length === 0 && quizSubmissions.length === 0) {
      return res.status(404).send('No submissions found.');
    }

    // Render the scoreboard view, passing both assignment and quiz submissions
    res.render('teacher/scoreboard', {
      assignmentSubmissions,
      quizSubmissions
    });
  } catch (error) {
    console.error('Error fetching scoreboard:', error);
    res.status(500).send('An error occurred while fetching the scoreboard. Please try again later.');
  }
};




// Grade Assignment
exports.gradeAssignmentPost = async (req, res) => {
  const { grade } = req.body;
  const submission = await StudentSubmission.findById(req.params.id);
  
  submission.grade = grade;
  await submission.save();

  res.redirect('/teacher/assignments');
};

// View enrolled students in quizzes and courses
exports.viewEnrolledStudents = async (req, res) => {
  try {
    // Find users who have enrolled in quizzes or courses
    const enrolledStudents = await User.find({
      $or: [
        { quizzes: { $exists: true, $ne: [] } }, // Students enrolled in quizzes
        { enrolledCourses: { $exists: true, $ne: [] } } // Students enrolled in courses
      ]
    })
    .populate('quizzes') // Populate quiz details
    .populate('enrolledCourses'); // Populate course details

    // Render the EJS view with the enrolled students
    res.render('teacher/enrolledStudents', { enrolledStudents });
  } catch (error) {
    console.error('Error fetching enrolled students:', error);
    res.status(500).send('Error fetching enrolled students');
  }
};


// Teacher Controller
// In your Teacher Controller
exports.gradeQuiz = async (req, res) => {
  try {
    const { quizId, studentId } = req.params; // Get quizId and studentId from the URL
    const { grade } = req.body; // Get the grade from the form

    // Assuming you have a StudentQuiz model to track scores
    await StudentQuiz.findOneAndUpdate(
      { quizId, studentId },
      { grade: grade }, // Update the score with the grade
      { new: true, upsert: true } // Create if it doesn't exist
    );

    // Redirect to the scoreboard after grading
    res.redirect('/teacher/scoreboard');
  } catch (error) {
    console.error('Error grading quiz:', error);
    res.status(500).send("Error grading quiz.");
  }
};








//exports.viewEnrolledStudents = async (req, res) => {
 // const courseId = req.params.id;

 // try {
   
 //   const course = await Course.findById(courseId).populate('students').exec();

  //  if (!course) {
  //    req.flash('error', 'Course not found');
  //    return res.redirect('/teacher/courses');
   // }

    
  //  res.render('teacher/enrolledStudents', { course, students: course.students });
 // } catch (error) {
 //   console.error(error);
 //   req.flash('error', 'Error fetching students');
 //   res.redirect('/teacher/courses');
 // }
//};


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

// View replies to notifications
exports.viewReplies = async (req, res) => {
  try {
      const teacherId = req.session.user._id; 
      const notifications = await Notification.find({ teacher: teacherId }).populate('student', 'username');

      // Populate replies for each notification
      const notificationsWithReplies = await Promise.all(notifications.map(async notification => {
          const replies = await Reply.find({ notification: notification._id }).populate('student', 'username');
          return { ...notification._doc, replies };
      }));

      res.render('teacher/viewreplies', { notifications: notificationsWithReplies });
  } catch (err) {
      console.error('Error fetching replies:', err);
      res.status(500).send('An error occurred while fetching replies.');
  }
};

// Render the report generation page
exports.renderReportPage = async (req, res) => {
  try {
    // Fetch all students to display in the report page
    const students = await User.find({ role: 'student' }); // Assuming you differentiate users by role

    res.render('teacher/report', { students });
  } catch (error) {
    console.error('Error rendering report page:', error);
    res.status(500).send('An error occurred while loading the report page.');
  }
};





// Generate report for a student
exports.generateStudentReport = async (req, res) => {
  try {
    const studentId = req.query.studentId; 

    // Fetch student's assignment grades
    const assignmentGrades = await StudentSubmission.find({ studentId })
      .populate('assignmentId', 'title')
      .select('assignmentId grade');

    // Fetch student's quiz grades
    const quizGrades = await StudentQuiz.find({ studentId })
      .populate('quizId', 'title')
      .select('quizId grade');

    // Fetch student's enrolled courses
    const student = await User.findById(studentId).populate('enrolledCourses', 'title');

    // Check if the student exists
    if (!student) {
      console.error(`No student found with ID: ${studentId}`);
      return res.status(404).send('Student not found');
    }

    // Initialize jsPDF
    const doc = new jsPDF();

    // Header
    doc.text(`Report for Student ID: ${studentId}`, 10, 10);

    // Assignments Section
    doc.text("Assignments:", 10, 20);
    if (assignmentGrades.length === 0) {
      doc.text("No assignments available.", 10, 30);
    } else {
      assignmentGrades.forEach((grade, index) => {
        const assignmentTitle = grade.assignmentId ? grade.assignmentId.title : 'Unknown Assignment';
        doc.text(
          `Assignment: ${assignmentTitle}, Grade: ${grade.grade}`,
          10,
          30 + (index * 10)
        );
      });
    }

    // Quizzes Section
    const quizStartY = 50 + assignmentGrades.length * 10;
    doc.text("Quizzes:", 10, quizStartY);
    if (quizGrades.length === 0) {
      doc.text("No quizzes available.", 10, quizStartY + 10);
    } else {
      quizGrades.forEach((grade, index) => {
        const quizTitle = grade.quizId ? grade.quizId.title : 'Unknown Quiz';
        doc.text(
          `Quiz: ${quizTitle}, Grade: ${grade.grade}`,
          10,
          quizStartY + 10 + (index * 10)
        );
      });
    }

    // Enrolled Courses Section
    const courseStartY = quizStartY + 30 + quizGrades.length * 10;
    doc.text("Enrolled Courses:", 10, courseStartY);
    if (!student.enrolledCourses || student.enrolledCourses.length === 0) {
      doc.text("No enrolled courses available.", 10, courseStartY + 10);
    } else {
      student.enrolledCourses.forEach((course, index) => {
        doc.text(
          `Course: ${course.title}`,
          10,
          courseStartY + 10 + (index * 10)
        );
      });
    }

    // Define the reports directory
    const reportsDir = path.join(__dirname, '../reports');

    // Check if the reports directory exists, create it if not
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir);
    }

    // Convert PDF document to buffer
    const pdfData = doc.output('arraybuffer');
    const reportPath = path.join(reportsDir, `report_${studentId}.pdf`);

    // Write PDF buffer to a file
    fs.writeFileSync(reportPath, Buffer.from(pdfData));

    // Send the PDF report to the client
    res.download(reportPath, (err) => {
      if (err) {
        console.error("Error downloading the report:", err);
        res.status(500).send('Error generating report');
      } else {
        // Optionally delete the file after sending
        fs.unlink(reportPath, (err) => {
          if (err) console.error("Error deleting report file:", err);
        });
      }
    });

  } catch (error) {
    console.error("Error generating student report:", error);
    res.status(500).send('An error occurred while generating the report.');
  }
};
