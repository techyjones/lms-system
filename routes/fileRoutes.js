const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');


router.use((req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/auth/login');
  }
});


router.post('/upload', fileController.upload, fileController.uploadFile);


router.get('/files/:category', fileController.getFiles);

module.exports = router;
