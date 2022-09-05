// Require dotenv .env file
require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Require dependencies
const mongoose = require('mongoose');
const compression = require('compression');

// Security dependencies
const helmet = require('helmet');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

// Dependencies for sessions
const session = require('express-session');
// const MongoStore = require('connect-mongo')(session);
const redis = require('redis');
const RedisStore = require('connect-redis')(session);
const redisClient = redis.createClient({
  port: '17889',
  host: process.env.REDIS,
  password: process.env.REDIS_PASS
});

// Dependencies for messages
const flash = require('connect-flash');

// For passport.js dependency
const User = require('./models/user');
const passport = require('passport');

// Require routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var dmRouter = require('./routes/dm')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Setup mongoose connection
const connectMongo = async () => {
  await mongoose.connect(process.env.DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
  });
}
connectMongo();
mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true); // Because of deprecation of ensureIndex

// DB Connection Error Detection
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to DB');
});

// Middleware
// Set up helmet middleware
app.use(helmet());

// Set up compress responses middleware
app.use(compression());

// Set up body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '100kb' })); // Body limit is 100kb

// Set up express-rate-limit middleware
// Reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
app.set('trust proxy', 1);

const limiter = rateLimit({
  windowMS: 1000 * 60 * 15,  // 15 min in ms
  max: 200, // Max requests per 15 min window
  message: 'You have exceeded the 100 requests in 15 minutes limit!',
  headers: true // Send the appropriate headers to the response (X-RateLimit-Limit, X-RateLimit-Remaining, Retry-After)
});

// Set up express-mongo-sanitize to protect against NoSQL Injection Attacks
app.use(mongoSanitize({ replaceWith: '_' }));

app.use(limiter);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Set up session middleware
app.use(session({
  secret: process.env.SECRET,
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 1 // 1 day
  },
  // store: new MongoStore({ mongooseConnection: mongoose.connection })
  store: new RedisStore({ client: redisClient })
}));

// Configure Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash messages
app.use(flash());

// Custom Middleware
app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.url = req.path;
  res.locals.flash = req.flash();
  res.locals.siteName = 'SideQuest DnD';
  res.locals.siteAlias = 'SideQuest';
  res.locals.cloudinaryFolder = 'sideQuest';
  next();
});

// Routes middleware
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);
app.use('/dm', dmRouter);

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
  req.app.get('env') == 'development'
    ? res.render('error')   // Renders dev error display
    : res.render('errorprod');  // Renders production error display
});

module.exports = app;
