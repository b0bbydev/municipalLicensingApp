// express related.
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var logger = require("morgan");
// include config files.
const credsConfig = require("./config/credsConfig");
const dbConfig = require("./config/dbConfig");
const sessionConfig = require("./config/sessionConfig");
// session related.
var session = require("express-session");
var MySQLStore = require("express-mysql-session")(session);
var sessionStore = new MySQLStore(credsConfig);

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
    name: sessionConfig.name,
    key: sessionConfig.key,
    secret: sessionConfig.secret,
    store: sessionStore, // use the sessionStore we created
    resave: sessionConfig.resave,
    saveUninitialized: sessionConfig.saveUninitialized,
    cookie: {
      httpOnly: sessionConfig.httpOnly,
      maxAge: sessionConfig.maxAge,
      sameSite: sessionConfig.sameSite,
      // secure: sessionConfig.secure, comment this out for now - this is to only send the cookie over an HTTPS (secure) connection. secure: process.env.NODE_ENV === "production",
    },
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "/public")));

// connection to db.
dbConfig.getConnection((err, connection) => {
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
