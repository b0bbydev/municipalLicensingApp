// express related.
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var logger = require("morgan");
// include config files.
const sessionStoreConfig = require("./config/sessionStore");
const db = require("./config/db");
// session related.
var session = require("express-session");
var MySQLStore = require("express-mysql-session")(session);
var sessionStore = new MySQLStore(sessionStoreConfig);
// dotenv.
require('dotenv').config();

// create routes here.
var loginRouter = require("./routes/login");
var registerRouter = require("./routes/register");
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
// use session info from sessionConfig file.
app.use(
  session({
    name: process.env.NAME,
    key: process.env.KEY,
    secret: process.env.SECRET,
    store: sessionStore, // use the sessionStore we created, this overrides the default "MemoryStore" for session saving, which isn't secure.
    resave: false, // set this to false so a new session isn't created every request. We can store it in the database instead, and update if we need to.
    saveUninitialized: false, // don't store anything about the user until there's data to store.
    cookie: {
      httpOnly: true, // setting this to true means JavaScript can't access the cookies - essential for security.
      maxAge: parseInt(process.env.MAX_AGE),
      sameSite: true,
      // secure: sessionConfig.secure, comment this out for now - this is to only send the cookie over an HTTPS (secure) connection. secure: process.env.NODE_ENV === "production",
    },
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "/public")));

// connection to db.
db.getConnection((err, connection) => {
  if (err) {
    console.log(err);
  } else {
    console.log("testdb Connection State: " + connection.state);
  }
});

// use routes here.
app.use("/login", loginRouter);
app.use("/register", registerRouter);
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
