const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');

// Middleware to check if user is authenticated
router.use((req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/auth/login');
  }
});

// Route to upload a file
router.post('/upload', fileController.upload, fileController.uploadFile);

// Route to get files based on category
router.get('/files/:category', fileController.getFiles);

module.exports = router;
