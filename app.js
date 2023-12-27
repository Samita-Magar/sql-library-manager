var createError = require('http-errors');
// import the sequelize instance
const { sequelize } = require("./models");
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// import Sequelize and the routes
const routes = require("./routes/index");
const books = require("./routes/books");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/books', books);

// Authenticate database connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log(`Successfully connected to the database`);
    // sync the model with the database
    await sequelize.sync();
  } catch (error) {
    console.error(`Unable to connect to the database, ${error}`);
  }
})();

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404, "Not Found"));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  
  if (err.status === 404) {
    res.status(404);
    res.render("page-not-found", { err });
  }

  res.render("error", { title: err.message });
});

module.exports = app;
