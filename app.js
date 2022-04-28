// config files.
var sessionConfig = require("./config/sessionConfig");
var dbConfig = require("./config/dbconfig");
// express related.
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
// authentication. (passport, session etc.)
var bodyParser = require("body-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const crypto = require("crypto");
var session = require("express-session");
var MySQLStore = require("express-mysql-session")(session);

// create routes here.
var loginRouter = require("./routes/login");
var indexRouter = require("./routes/index");
var dropdownRouter = require("./routes/dropdown");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    key: sessionConfig.key,
    secret: sessionConfig.secret,
    store: new MySQLStore({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      database: dbConfig.database,
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: sessionConfig.maxAge,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static(path.join(__dirname, "/public")));

// use routes here.
app.use("/login", loginRouter);
app.use("/", indexRouter);
app.use("/dropdown", dropdownRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
