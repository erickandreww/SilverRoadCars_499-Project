var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var db = require('./config/db')


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var vehiclesRouter = require('./routes/vehicles');

var app = express();

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/vehicles', vehiclesRouter);

// 1. Catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err); // This pushes it to the block below
});

// 2. Error handler (Must have ALL 4 arguments: err, req, res, next)
app.use(function(err, req, res, next) {
  // Set default status code if none exists
  var statusCode = err.status || 500;
  
  res.status(statusCode);
  
  // Send the data directly to your EJS template
  res.render('errors/error', {
    message: err.message,
    status: statusCode,
    // Only show stack trace if we are in development mode
    error: req.app.get('env') === 'development' ? err : {}
  });
});

app.get('/db-test', async function(req, res) {
  try {
    // This runs a native PostgreSQL command to get the current server time
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

module.exports = app;
