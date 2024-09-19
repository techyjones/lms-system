const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

// Middleware to check if user is authenticated and authorized
router.use((req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/auth/login');
  }
});

// Route to view all courses
router.get('/', courseController.viewAllCourses);

// Route to create a new course
router.post('/create', courseController.createCourse);

// Route to get details of a specific course
router.get('/:id', courseController.viewCourseDetails);

// Route to update a specific course
router.put('/:id', courseController.updateCourse);

// Route to delete a specific course
router.delete('/:id', courseController.deleteCourse);

module.exports = router;
