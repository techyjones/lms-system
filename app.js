require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const morgan = require('morgan');
const path = require('path');
const { swaggerRouter, swaggerSetup } = require('./swagger');
const cookieParser = require('cookie-parser');

// Custom CORS options
const corsOptions = {
  origin: 'http://localhost:3000',  // Frontend's URL
  optionsSuccessStatus: 200,        // Legacy browsers
  credentials: true,                // If using cookies/auth
};

app.use(cors(corsOptions)); // Apply CORS middleware

app.set('view engine', 'ejs');
mongoose.connect('mongodb://localhost/shanai-lms', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
  secret: 'securemywork',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }, // Set to true if using HTTPS
}));

// Swagger route
app.use('/api-docs', swaggerRouter, swaggerSetup);

app.use(morgan('dev'));
app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success');
  res.locals.error_msg = req.flash('error');
  next();
});

// Ensure CORS headers are set for all responses
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');  // Set allowed origin
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// Routes
const fileRoutes = require('./routes/fileRoutes');
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const teacherRoutes = require('./routes/teacher');
const studentRoutes = require('./routes/student');
const adminRoutes = require('./routes/admin');
const courseRoutes = require('./routes/courseRoutes');

app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/teacher', teacherRoutes);
app.use('/student', studentRoutes);
app.use('/admin', adminRoutes);
app.use('/courses', courseRoutes);
app.use('/teacher', fileRoutes);
app.use('/student', fileRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
