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
var registerRouter = require("./routes/register");
var indexRouter = require("./routes/index");
var dropdownRouter = require("./routes/dropdown");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

/* Passport JS */
const fields = {
  usernameField: "email",
  passwordField: "password",
};

const verifyCallback = (username, password, done) => {
  dbConfig.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    function (error, results, fields) {
      if (error) {
        return done(error);
      }

      if (results.length == 0) {
        return done(null, false);
      }

      const isValid = validPassword(password, results[0].hash, results[0].salt);
      user = {
        id: results[0].id,
        username: results[0].username,
        hash: results[0].hash,
        salt: results[0].salt,
      };
      if (isValid) {
        return done(null, user);
      } else {
        return done(null, false);
      } // end of if-else.
    }
  );
};

// create strategy.
const strategy = new LocalStrategy(fields, verifyCallback);
passport.use(strategy);

// serialize & deserialize the user.
passport.serializeUser((user, done) => {
  console.log("inside serialize");
  done(null, user.id);
});

passport.deserializeUser(function (userID, done) {
  console.log("deserializeUser" + userID);
  connection.query(
    "SELECT * FROM users where userID = ?",
    [userID],
    function (error, results) {
      done(null, results[0]);
    }
  );
});

/* Middleware */
function validPassword(password, hash, salt) {
  var hashVerify = crypto
    .pbkdf2Sync(password, salt, 10000, 60, "sha512")
    .toString("hex");
  return hash === hashVerify;
}

function genPassword(password) {
  var salt = crypto.randomBytes(32).toString("hex");
  var genhash = crypto
    .pbkdf2Sync(password, salt, 10000, 60, "sha512")
    .toString("hex");
  return { salt: salt, hash: genhash };
}

function userExists(req, res, next) {
  connection.query(
    "SELECT * FROM users WHERE username = ?",
    [req.body.username],
    function (error, results, fields) {
      if (error) {
        console.log("Error");
      } else if (results.length > 0) {
        res.redirect("/login");
      } else {
        next();
      }
    } // end of function().
  );
} // end of userExists().

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
