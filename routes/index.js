const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', { title: 'SHANAI LMS' });
});

module.exports = router;
    