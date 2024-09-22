const path = require('path');
const multer = require('multer');
const File = require('../models/fileModel');
const fs = require('fs');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'public/uploads/';
    if (file.fieldname === 'assignment') {
      uploadPath += 'assignments/';
    } else if (file.fieldname === 'material') {
      uploadPath += 'materials/';
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });


exports.uploadFile = async (req, res) => {
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

// Retrieve files (particualr categ)
exports.getFiles = async (req, res) => {
  const { category } = req.params;
  const files = await File.find({ category });
  res.render('student/materials', { files });
};


exports.upload = upload.single('file');
