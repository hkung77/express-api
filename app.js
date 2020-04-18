var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'react');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// CORs setup
const allowedOrigins = [
    'https://nba.hkung.me',
    // uncomment for development purposes
    // 'localhost:8080',
    // 'localhost:3000',
];

app.use(cors({
    origin: (origin, callback) => {
        // allow requests from mobile or curl
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) > -1) {
            const msg = `The CORS policy for this site does not contain allowed access from the specified Origin`;
            return callback(new Error(msg), false);
        }
    },
}));

app.use('/', indexRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
