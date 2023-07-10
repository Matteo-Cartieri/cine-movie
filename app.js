var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const moment = require('moment');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const userDao = require('./models/user-dao.js');
let requirejs = require('requirejs');

const indexRouter = require('./routes/index');
const sessionsRouter = require('./routes/sessions');
const loginRouter = require('./routes/login');
const insertFilmRouter = require('./routes/insert-film');
const filmPageRouter = require('./routes/film-page');
const seatRouter = require('./routes/seat-booking');
const signupRouter = require('./routes/signup');
const reviewRouter = require('./routes/insert-review');
const infoRouter = require('./routes/info');
const userRouter = require('./routes/user');
const usersAreaRouter = require('./routes/users-area.js');
const filmsAreaRouter = require('./routes/films-area.js');

const { Passport } = require('passport');

requirejs.config({
  baseUrl: __dirname,
  nodeRequire: require
});


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// define default variables for the views
app.use(function (req, res, next) {
  app.locals.moment = moment;
  app.locals.title = '';
  app.locals.message = '';
  app.locals.active = '';
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Implementazione logica login
passport.use(new LocalStrategy(
  function(username, password, done) {
    userDao.getUser(username, password).then(({user, check}) => {
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!check) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    })
  }
));

// Serialize and de-serialize the user (user object <-> session)
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  userDao.getUserById(id).then(user => {
    done(null, user);
  });
});

// set up the session
app.use(session({
  secret: 'a secret sentence not to share with anybody and anywhere, used to sign the session ID cookie',
  resave: false,
  saveUninitialized: false 
}));

// Inizializzazione passport
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/sessions', sessionsRouter);
app.use('/film-page', filmPageRouter);
app.use('/seat-booking', seatRouter);
app.use('/info', infoRouter);
app.use('/signup', signupRouter);
app.use('/insert-review', reviewRouter);
app.use('/insert-film', insertFilmRouter);
app.use('/user', userRouter);
app.use('/users-area', usersAreaRouter);
app.use('/films-area', filmsAreaRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
