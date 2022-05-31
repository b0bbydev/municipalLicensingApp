// dotenv.
require("dotenv").config();
// express related.
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var logger = require("morgan");
const hbs = require("hbs");
// include pagination library.
const paginate = require("express-paginate");
// include config files.
const sessionStoreConfig = require("./config/sessionStore");
const db = require("./config/db");
// session related.
var session = require("express-session");
var MySQLStore = require("express-mysql-session")(session);
var sessionStore = new MySQLStore(sessionStoreConfig);
// sequelize.
const sequelize = require("./config/dbConfig");

// create routes here.
var loginRouter = require("./routes/login");
var indexRouter = require("./routes/index");

/* policies related routes. */
var policiesRouter = require("./routes/policies/index");

/* dropdown related routes. */
var dropdownRouter = require("./routes/dropdownManager/index");

/* dogtag related routes. */
var dogTagRouter = require("./routes/dogtags/index");
// owners.
var addOwnerRouter = require("./routes/dogtags/addOwner");
var editOwnerRouter = require("./routes/dogtags/editOwner");
// dogs.
var addDogRouter = require("./routes/dogtags/addDog");
var editDogRouter = require("./routes/dogtags/editDog");

var app = express();

// keep this before all routes that will use pagination.
app.use(paginate.middleware(10, 50));

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
    name: process.env.SESSION_NAME,
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
try {
  //sequelize.sync({ force: true });
  sequelize.sync();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

// helper functions.
hbs.registerHelper("inc", function (value, options) {
  return parseInt(value) * 50;
});

hbs.registerHelper("ifEquals", function (arg1, arg2, options) {
  return arg1 == arg2 ? options.fn(this) : options.inverse(this);
});

// use routes here.
app.use("/login", loginRouter);
app.use("/", indexRouter);
app.use("/dropdownManager", dropdownRouter);

/* policies related routes. */
app.use("/policies", policiesRouter);

/* dogtag related routes. */
app.use("/dogtags", dogTagRouter);
// owner.
app.use("/dogtags/addOwner", addOwnerRouter);
app.use("/dogtags/editOwner", editOwnerRouter);
// dog.
app.use("/dogtags/addDog", addDogRouter);
app.use("/dogtags/editDog", editDogRouter);

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
