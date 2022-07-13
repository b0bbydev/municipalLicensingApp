// dotenv.
require("dotenv").config();
// express related.
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
const hbs = require("hbs");
const helmet = require("helmet");
// logging.
var morgan = require("morgan");
var logger = require("./config/logger");
// include pagination library.
const paginate = require("express-paginate");
// include config files.
const sessionStoreConfig = require("./config/sessionStore");
// session related.
var session = require("express-session");
var MySQLStore = require("express-mysql-session")(session);
var sessionStore = new MySQLStore(sessionStoreConfig);
// sequelize.
const sequelize = require("./config/sequelizeConfig");
// groupBy helper.
var groupBy = require("handlebars-group-by");
// create routes here.
var loginRouter = require("./routes/login");
var indexRouter = require("./routes/index");
// request limiter.
const limiter = require("./config/limiter");
var moment = require("moment");
// authHelper middleware.
const {
  isLoggedIn,
  auth,
  isAdmin,
  isDogLicense,
  isPolicy,
} = require("./config/authHelpers");

/* admin related routes */
var adminRouter = require("./routes/admin/index");
var adminAddUserRouter = require("./routes/admin/addUser");
var adminEditUserRouter = require("./routes/admin/editUser");

/* adult entertainment related routes */
var adultEntertainmentRouter = require("./routes/adultEntertainment/index");

/* policies related routes. */
var policiesRouter = require("./routes/policies/index");
var addPoliciesRouter = require("./routes/policies/addPolicy");
var editPolicyRouter = require("./routes/policies/editPolicy");

var addProcedureRouter = require("./routes/policies/addProcedure");
var editProcedureRouter = require("./routes/policies/editProcedure");

var addGuidelineRouter = require("./routes/policies/addGuideline");
var editGuidelineRouter = require("./routes/policies/editGuideline");

/* dropdown related routes. */
var dropdownRouter = require("./routes/dropdownManager/index");

/* dogtag related routes. */
var dogTagRouter = require("./routes/dogtags/index");
// owners.
var addOwnerRouter = require("./routes/dogtags/addOwner");
var addAdditionalOwnerRouter = require("./routes/dogtags/addAdditionalOwner");
var editOwnerRouter = require("./routes/dogtags/editOwner");
// dogs.
var addDogRouter = require("./routes/dogtags/addDog");
var editDogRouter = require("./routes/dogtags/editDog");

var app = express();

// keep this before all routes that will use pagination.
app.use(paginate.middleware(15, 50));

// reduce 'finger printing'.
app.disable("x-powered-by");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

// causing static files to not load on server?
// use logger with morgan.
//app.use(morgan("dev", { stream: logger.stream.write }));
// helmet - protecting against common HTTP vulnerabilities.
//app.use(helmet());

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
      //secure: process.env.SECURE, //comment this out for now - this is to only send the cookie over an HTTPS (secure) connection. secure: process.env.NODE_ENV === "production", was also creating multple sessions upon login which would screw up auth process?
    },
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// static() used for serving static files like images, css etc..
app.use(express.static(path.join(__dirname, "/public")));

// connection to db.
try {
  //sequelize.sync({ force: true });
  //sequelize.sync({ alter: true });
  sequelize.sync();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

// group by helper.
groupBy.register(hbs);

// this helper will add the ability for logical operators in hbs. usage: {{#ifCond var1 '==' var2}}.
hbs.registerHelper("ifCond", function (v1, operator, v2, options) {
  switch (operator) {
    case "==":
      return v1.toLowerCase() == v2.toLowerCase()
        ? options.fn(this)
        : options.inverse(this);
    case "===":
      return v1 === v2 ? options.fn(this) : options.inverse(this);
    case "!=":
      return v1 != v2 ? options.fn(this) : options.inverse(this);
    case "!==":
      return v1 !== v2 ? options.fn(this) : options.inverse(this);
    case "<":
      return v1 < v2 ? options.fn(this) : options.inverse(this);
    case "<=":
      return v1 <= v2 ? options.fn(this) : options.inverse(this);
    case ">":
      return v1 > v2 ? options.fn(this) : options.inverse(this);
    case ">=":
      return v1 >= v2 ? options.fn(this) : options.inverse(this);
    case "&&":
      return v1 && v2 ? options.fn(this) : options.inverse(this);
    case "||":
      return v1 || v2 ? options.fn(this) : options.inverse(this);
    default:
      return options.inverse(this);
  }
});

// formats dates, mostly used for lastModifed columns.
hbs.registerHelper("formatDate", function (str) {
  return moment(str).format("YYYY-MM-DD h:mm:ss A");
});

// return lowercase string.
hbs.registerHelper("lowercase", function (str) {
  return str.toLowerCase();
});

// check if session var 'auth' includes valid authLevel.
hbs.registerHelper("includes", function (array, value, options) {
  if (array.includes(value)) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

// use routes here.
app.use("/login", loginRouter);
app.use("/", indexRouter);

/* admin related routes */
app.use("/admin", isAdmin, adminRouter);
app.use("/admin/addUser", isAdmin, adminAddUserRouter);
app.use("/admin/editUser", isAdmin, adminEditUserRouter);

/* dropdownManager related routes */
app.use("/dropdownManager", isAdmin, dropdownRouter);

/* adult entertainment related routes */
app.use("/adultEntertainment", adultEntertainmentRouter);

/* policies related routes. */
app.use("/policies", isPolicy, policiesRouter);
app.use("/policies/addPolicy", isPolicy, addPoliciesRouter);
app.use("/policies/editPolicy", isPolicy, editPolicyRouter);

app.use("/policies/addProcedure", isPolicy, addProcedureRouter);
app.use("/policies/editProcedure", isPolicy, editProcedureRouter);

app.use("/policies/addGuideline", isPolicy, addGuidelineRouter);
app.use("/policies/editGuideline", isPolicy, editGuidelineRouter);

/* dogtag related routes. */
app.use("/dogtags", isDogLicense, dogTagRouter);
// owner.
app.use("/dogtags/addOwner", isDogLicense, addOwnerRouter);
app.use("/dogtags/addAdditionalOwner", isDogLicense, addAdditionalOwnerRouter);
app.use("/dogtags/editOwner", isDogLicense, editOwnerRouter);
// dog.
app.use("/dogtags/addDog", isDogLicense, addDogRouter);
app.use("/dogtags/editDog", isDogLicense, editDogRouter);

// catch 404 and forward to error handler
app.use(limiter, function (req, res, next) {
  next(createError(404));
});

// for morgan logging.
// app.use(limiter, function (err, req, res, next) {
//   // format the log message.
//   logger.error(
//     `'HTTP Method: ${req.method} - ${err.message} | Site URL: '${req.originalUrl}' - ${req.ip} | User: ${req.session.email}`
//   );
//   next(err);
// });

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
