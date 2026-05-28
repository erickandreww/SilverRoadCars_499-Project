var express = require('express');
const expressLayouts = require("express-ejs-layouts")
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var db = require('./config/db');

var indexRouter = require('./routes/index');

var app = express();

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(expressLayouts)
app.set("layout", "./layouts/layout") 

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'silverroad-dev-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 24 hours
}));

// Make session user available in all EJS views
app.use((req, res, next) => {
  res.locals.sessionUser = req.session.user || null;
  next();
});

app.use('/', indexRouter);

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

// DB health check
app.get('/db-test', async function(req, res) {
  try {
    var result = await db.query('SELECT NOW();');
    res.json({
      success: true,
      message: "Express successfully connected to PostgreSQL!",
      db_time: result.rows[0].now
    });
  } catch (err) {
    console.error("Database connection error details:", err);
    res.status(500).json({
      success: false,
      message: "Database connection failed.",
      error: err.message
    });
  }
});

// 1. Catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// 2. Error handler (Must have ALL 4 arguments: err, req, res, next)
app.use(function(err, req, res, next) {
  var statusCode = err.status || 500;
  res.status(statusCode);
  res.render('errors/error', {
    title: 'Error',
    message: err.message,
    status: statusCode,
    error: req.app.get('env') === 'development' ? err : {}
  });
});

module.exports = app;
