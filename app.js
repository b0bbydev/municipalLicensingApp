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
// express-rate-limit.
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: "Too many requests! Slow down!",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/* policies related routes. */
var policiesRouter = require("./routes/policies/index");
var addPoliciesRouter = require("./routes/policies/addPolicy");
var editPolicyRouter = require("./routes/policies/editPolicy");

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
      secure: process.env.SECURE, //comment this out for now - this is to only send the cookie over an HTTPS (secure) connection. secure: process.env.NODE_ENV === "production",
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

// helper functions.
hbs.registerHelper("ifEquals", function (arg1, arg2, options) {
  return arg1 == arg2 ? options.fn(this) : options.inverse(this);
});

// group by helper.
groupBy.register(hbs);

// use routes here.
app.use("/login", loginRouter);
app.use("/", indexRouter);

/* dropdownManager related routes */
app.use("/dropdownManager", dropdownRouter);

/* policies related routes. */
app.use("/policies", policiesRouter);
app.use("/policies/addPolicy", addPoliciesRouter);
app.use("/policies/editPolicy", editPolicyRouter);

/* dogtag related routes. */
app.use("/dogtags", dogTagRouter);
// owner.
app.use("/dogtags/addOwner", addOwnerRouter);
app.use("/dogtags/addAdditionalOwner", addAdditionalOwnerRouter);
app.use("/dogtags/editOwner", editOwnerRouter);
// dog.
app.use("/dogtags/addDog", addDogRouter);
app.use("/dogtags/editDog", editDogRouter);

// catch 404 and forward to error handler
app.use(limiter, function (req, res, next) {
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
