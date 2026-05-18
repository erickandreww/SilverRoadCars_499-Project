var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var db = require('./config/db')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
