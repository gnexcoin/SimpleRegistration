var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var flash = require('connect-flash');
var session = require('express-session');

var db = require("./db");

var indexRouter = require('./routes/index');
var createRouter = require('./routes/create');
var adminRouter = require('./routes/admin');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET,
  name: process.env.SESSION_NAME,
  // store: sessionStore, // connect-mongo session store
  proxy: true,
  resave: true,
  saveUninitialized: true
}));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/create', createRouter);
app.use('/admin', adminRouter);

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

(async (path, db, app) => {
  let dbInstance = await db.openDb(path);

  await db.createDb(dbInstance);

  app.locals.db = dbInstance;
  
  /*
  let pk = await db.insertRequest(dbInstance, "test", "test", "test@test");
  console.log(pk);

  await db.approveRequest(dbInstance, pk);
  await db.rejectRequest(dbInstance, pk);
  */
})(process.env.DATABASE_PATH, db, app);

module.exports = app;
