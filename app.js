const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const app = express();
const morgan = require('morgan');
const path = require('path');
const { swaggerRouter, swaggerSetup } = require('./swagger');
const cookieParser = require('cookie-parser');  // Add this


app.set('view engine', 'ejs');
mongoose.connect('mongodb://localhost/shanai-lms', { useNewUrlParser: true, useUnifiedTopology: true });


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
  app.use(session({
    secret: 'securemywork',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
  }));

app.use('/api-docs', swaggerRouter, swaggerSetup);

app.use(morgan('dev'));
app.use(flash());

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success');
    res.locals.error_msg = req.flash('error');
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
