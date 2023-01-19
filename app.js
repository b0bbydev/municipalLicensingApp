/*
 * @author Bobby Jonkman
 */

// dotenv.
require("dotenv").config();
// express related.
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
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
// request limiter.
// const limiter = require("./config/limiter");
// moment.js
var moment = require("moment");
// logger.
const logger = require("./config/logger");
// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
// const sgMail = require("@sendgrid/mail");
// sgMail.setApiKey(process.env.SEND_GRID_KEY);
const fs = require("fs");
var CronJob = require("cron").CronJob;
// authHelper middleware.
const { isAdmin, isEnforcement, isPolicy } = require("./config/authHelpers");

/* create routes here. */
var loginRouter = require("./routes/login");
var indexRouter = require("./routes/index");

var iisReset = require("./routes/iisreset/index");

/* admin related routes */
var adminRouter = require("./routes/admin/index");
var adminAddUserRouter = require("./routes/admin/addUser");
var adminEditUserRouter = require("./routes/admin/editUser");
var adminManageAccessRouter = require("./routes/admin/manageAccess");

/* adult entertainment related routes */
var adultEntertainmentRouter = require("./routes/adultEntertainment/index");
var adultEntertainmentAddBusinessRouter = require("./routes/adultEntertainment/addBusiness");
var adultEntertainmentEditBusinessRouter = require("./routes/adultEntertainment/editBusiness");
var adultEntertainmentAddressHistoryRouter = require("./routes/adultEntertainment/businessAddressHistory");
var adultEntertainmentBusinessHistoryRouter = require("./routes/adultEntertainment/businessHistory");

/* policies related routes. */
var policiesRouter = require("./routes/policies/index");
var addRecordRouter = require("./routes/policies/addRecord");
var addPoliciesRouter = require("./routes/policies/addPolicy");
var editPolicyRouter = require("./routes/policies/editPolicy");

var proceduresRouter = require("./routes/policies/procedures");
var addProcedureRouter = require("./routes/policies/addProcedure");
var editProcedureRouter = require("./routes/policies/editProcedure");

var guidelinesRouter = require("./routes/policies/guidelines");
var addGuidelineRouter = require("./routes/policies/addGuideline");
var editGuidelineRouter = require("./routes/policies/editGuideline");

/* dropdown related routes. */
var dropdownRouter = require("./routes/dropdownManager/index");
var dropdownFormRouter = require("./routes/dropdownManager/form");

/* dogtag related routes. */
var dogTagRouter = require("./routes/dogtags/index");
// owners.
var addOwnerRouter = require("./routes/dogtags/addOwner");
var addAdditionalOwnerRouter = require("./routes/dogtags/addAdditionalOwner");
var editOwnerRouter = require("./routes/dogtags/editOwner");
// dogs.
var addDogRouter = require("./routes/dogtags/addDog");
var editDogRouter = require("./routes/dogtags/editDog");

/* Send SMS routes */
var sendSmsRouter = require("./routes/sendSms/index");

/* Street Closure Permits related routes. */
var streetClosurePermitRouter = require("./routes/streetClosurePermit/index");
var addStreetClosurePermitRouter = require("./routes/streetClosurePermit/addPermit");
var editStreetClosurePermitRouter = require("./routes/streetClosurePermit/editPermit");

/* Donation Bin related routes */
var donationBinRouter = require("./routes/donationBin/index");

var donationBinAddressHistoryRouter = require("./routes/donationBin/donationBinAddressHistory");

var donationBinPropertyOwnerAddressHistoryRouter = require("./routes/donationBin/donationBinPropertyOwnerAddressHistory");

var donationBinOperatorAddressHistoryRouter = require("./routes/donationBin/donationBinOperatorAddressHistory");

var addDonationBinCharityRouter = require("./routes/donationBin/addCharity");
var editDonationBinCharityRouter = require("./routes/donationBin/editCharity");

var addPropertyOwnerRouter = require("./routes/donationBin/addPropertyOwner");
var editPropertyOwnerRouter = require("./routes/donationBin/editPropertyOwner");

var addDonationBinOperatorRouter = require("./routes/donationBin/addOperator");
var editDonationBinOperatorRouter = require("./routes/donationBin/editOperator");

var addDonationBinRouter = require("./routes/donationBin/addDonationBin");
var editDonationBinRouter = require("./routes/donationBin/editDonationBin");

var binsRoute = require("./routes/donationBin/bins");

var donationBinHistoryRoute = require("./routes/donationBin/donationBinHistory");

/* Hawker & Peddler related routes */
var hawkerPeddlerRoute = require("./routes/hawkerPeddler/index");

var hawkerPeddlerBusinessAddressHistoryRoute = require("./routes/hawkerPeddler/businessAddressHistory");

var hawkerPeddlerPropertyOwnerAddressHistoryRoute = require("./routes/hawkerPeddler/propertyOwnerAddressHistory");

var hawkerPeddlerApplicantAddressHistoryRoute = require("./routes/hawkerPeddler/applicantAddressHistory");

var hawkerPeddlerAddPropertyOwnerRoute = require("./routes/hawkerPeddler/addPropertyOwner");
var hawkerPeddlerEditPropertyOwnerRoute = require("./routes/hawkerPeddler/editPropertyOwner");

var hawkerPeddlerAddBusinessRoute = require("./routes/hawkerPeddler/addBusiness");
var hawkerPeddlerEditBusinessRoute = require("./routes/hawkerPeddler/editBusiness");

var hawkerPeddlerAddOperatorRoute = require("./routes/hawkerPeddler/addOperator");
var hawkerPeddlerEditOperatorRoute = require("./routes/hawkerPeddler/editOperator");

var hawkerPeddlerBusinessRoute = require("./routes/hawkerPeddler/business");

var hawkerPeddlerOperatorHistoryRoute = require("./routes/hawkerPeddler/operatorHistory");

/* Kennel related routes */
var kennelsRoute = require("./routes/kennels/index");

var kennelAddressHistoryRoute = require("./routes/kennels/kennelAddressHistory");

var kennelOwnerAddressHistoryRoute = require("./routes/kennels/kennelOwnerAddressHistory");

var kennelPropertyOwnerAddressHistoryRoute = require("./routes/kennels/kennelPropertyOwnerAddressHistory");

var kennelRoute = require("./routes/kennels/kennel");
var kennelHistoryRoute = require("./routes/kennels/kennelHistory");
var addKennelRoute = require("./routes/kennels/addKennel");
var editKennelRoute = require("./routes/kennels/editKennel");

var addKennelPropertyOwnerRoute = require("./routes/kennels/addPropertyOwner");
var editKennelPropertyOwnerRoute = require("./routes/kennels/editPropertyOwner");

var addKennelOwnerRoute = require("./routes/kennels/addKennelOwner");
var editKennelOwnerRoute = require("./routes/kennels/editKennelOwner");

/* Liquor License related routes */
var liquorRoute = require("./routes/liquor/index");

var liquorBusinessAddressHistoryRoute = require("./routes/liquor/businessAddressHistory");

var addLiquorBusinessRoute = require("./routes/liquor/addBusiness");
var editLiquorBusinessRoute = require("./routes/liquor/editBusiness");

/* Refreshment Vehicle related routes. */
var refreshmentVehicleRoute = require("./routes/refreshmentVehicles/index");

var refreshmentVehicleOperatorAddressHistoryRoute = require("./routes/refreshmentVehicles/vehicleOperatorAddressHistory");

var refreshmentVehicleOwnerAddressHistoryRoute = require("./routes/refreshmentVehicles/vehicleOwnerAddressHistory");

var refreshmentVehiclePropertyOwnerAddressHistoryRoute = require("./routes/refreshmentVehicles/vehiclePropertyOwnerAddressHistory");

var addRefreshmentVehicleRoute = require("./routes/refreshmentVehicles/addVehicle");
var editRefreshmentVehicleRoute = require("./routes/refreshmentVehicles/editVehicle");

var vehicleRoute = require("./routes/refreshmentVehicles/vehicle");

var vehicleHistoryRoute = require("./routes/refreshmentVehicles/vehicleHistory");

var addRefreshmentVehiclePropertyOwner = require("./routes/refreshmentVehicles/addPropertyOwner");
var editRefreshmentVehiclePropertyOwner = require("./routes/refreshmentVehicles/editPropertyOwner");

var addRefreshmentVehicleOwner = require("./routes/refreshmentVehicles/addVehicleOwner");
var editRefreshmentVehicleOwner = require("./routes/refreshmentVehicles/editVehicleOwner");

var addRefreshmentVehicleOperator = require("./routes/refreshmentVehicles/addVehicleOperator");
var editRefreshmentVehicleOperator = require("./routes/refreshmentVehicles/editVehicleOperator");

/* POA Matter related routes */
var poaMattersRoute = require("./routes/poaMatters/index");

var addPoaMatterRoute = require("./routes/poaMatters/addPoaMatter");
var editPoaMatterRoute = require("./routes/poaMatters/editPoaMatter");

var addAdditionalTrialDates = require("./routes/poaMatters/addTrialDates");

/* Taxi related routes */
var taxiLicenseRoute = require("./routes/taxiLicenses/index");

var taxiLicenseBrokerAddressHistoryRoute = require("./routes/taxiLicenses/brokerAddressHistory");

var taxiLicenseDriverAddressHistoryRoute = require("./routes/taxiLicenses/driverAddressHistory");

var taxiLicensePlateOwnerAddressHistoryRoute = require("./routes/taxiLicenses/plateOwnerAddressHistory");

var addTaxiBrokerRoute = require("./routes/taxiLicenses/addBroker");
var editTaxiBrokerRoute = require("./routes/taxiLicenses/editBroker");

var taxiBrokerRoute = require("./routes/taxiLicenses/broker");

var taxiBrokerHistoryRoute = require("./routes/taxiLicenses/brokerHistory");
var taxiDriverHistoryRoute = require("./routes/taxiLicenses/driverHistory");
var taxiPlateHistoryRoute = require("./routes/taxiLicenses/plateHistory");

var addTaxiDriverRoute = require("./routes/taxiLicenses/addDriver");
var editTaxiDriverRoute = require("./routes/taxiLicenses/editDriver");

var addTaxiPlateRoute = require("./routes/taxiLicenses/addPlate");
var editTaxiPlateRoute = require("./routes/taxiLicenses/editPlate");

var app = express();

// keep this before all routes that will use pagination.
app.use(paginate.middleware(15, 50));

// reduce 'finger printing'.
app.disable("x-powered-by");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// trust reverse proxy
app.set("trust proxy");
// use session info from sessionConfig file.
app.use(
  session({
    name: process.env.SESSION_NAME,
    key: process.env.KEY,
    secret: process.env.SECRET,
    store: sessionStore, // use the sessionStore we created, this overrides the default "MemoryStore" for session saving, which isn't secure.
    resave: false, // set this to false so a new session isn't created every request. We can store it in the database instead, and update if we need to.
    saveUninitialized: false, // don't store anything about the user until there's data to store.
    proxy: true, // trust reverse proxy -- newly added, need to test on prod.
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
  sequelize.sync({ logging: false });
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
  if (!str || str === undefined || str === null) {
    return;
  } else {
    return str.toLowerCase();
  }
});

// check if session var 'auth' includes valid authLevel.
hbs.registerHelper("includes", function (array, value, options) {
  if (!array || !value) {
    return;
  }

  if (array.indexOf(value) > -1) {
    return options.fn(this);
  }

  return options.inverse(this);
});

hbs.registerHelper("incremented", function (index) {
  index++;
  return index;
});

// this helper is used for pagination.
hbs.registerHelper("contains", function (string, value, options) {
  if (!string || string === undefined || string === null) {
    return;
  }
  if (string.includes("page=" + value)) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

// use routes here.
app.use("/login", loginRouter);
app.use("/", indexRouter);

// force iisreset by crashing the app. (should restart since running as a service on Windows Server)
app.use("/iisreset", isAdmin, iisReset);

/* admin related routes */
app.use("/admin", isAdmin, adminRouter);
app.use("/admin/addUser", isAdmin, adminAddUserRouter);
app.use("/admin/editUser", isAdmin, adminEditUserRouter);
app.use("/admin/manageAccess", isAdmin, adminManageAccessRouter);

/* dropdownManager related routes */
app.use("/dropdownManager", isAdmin, dropdownRouter);
app.use("/dropdownManager/form", isAdmin, dropdownFormRouter);

/* Send SMS related routes */
app.use("/sendSms", isAdmin, sendSmsRouter);

/* adult entertainment licensing related routes */
app.use("/adultEntertainment", isEnforcement, adultEntertainmentRouter);
app.use(
  "/adultEntertainment/addBusiness",
  isEnforcement,
  adultEntertainmentAddBusinessRouter
);
app.use(
  "/adultEntertainment/editBusiness",
  isEnforcement,
  adultEntertainmentEditBusinessRouter
);

app.use(
  "/adultEntertainment/businessAddressHistory",
  isEnforcement,
  adultEntertainmentAddressHistoryRouter
);

app.use(
  "/adultEntertainment/businessHistory",
  isEnforcement,
  adultEntertainmentBusinessHistoryRouter
);

/* policies related routes. */
app.use("/policies", isPolicy, policiesRouter);
app.use("/policies/addRecord", isPolicy, addRecordRouter);
app.use("/policies/addPolicy", isPolicy, addPoliciesRouter);
app.use("/policies/editPolicy", isPolicy, editPolicyRouter);

app.use("/policies/procedures", isPolicy, proceduresRouter);
app.use("/policies/addProcedure", isPolicy, addProcedureRouter);
app.use("/policies/editProcedure", isPolicy, editProcedureRouter);

app.use("/policies/guidelines", isPolicy, guidelinesRouter);
app.use("/policies/addGuideline", isPolicy, addGuidelineRouter);
app.use("/policies/editGuideline", isPolicy, editGuidelineRouter);

/* dogtag related routes. */
app.use("/dogtags", isEnforcement, dogTagRouter);
// owner.
app.use("/dogtags/addOwner", isEnforcement, addOwnerRouter);
app.use("/dogtags/addAdditionalOwner", isEnforcement, addAdditionalOwnerRouter);
app.use("/dogtags/editOwner", isEnforcement, editOwnerRouter);
// dog.
app.use("/dogtags/addDog", isEnforcement, addDogRouter);
app.use("/dogtags/editDog", isEnforcement, editDogRouter);

/* Street Closure Permits related routes. */
app.use("/streetClosurePermit", isEnforcement, streetClosurePermitRouter);
app.use(
  "/streetClosurePermit/addPermit",
  isEnforcement,
  addStreetClosurePermitRouter
);
app.use(
  "/streetClosurePermit/editPermit",
  isEnforcement,
  editStreetClosurePermitRouter
);

/* Donation Bin related routes */
app.use("/donationBin", isEnforcement, donationBinRouter);

app.use(
  "/donationBin/donationBinAddressHistory",
  isEnforcement,
  donationBinAddressHistoryRouter
);

app.use(
  "/donationBin/donationBinPropertyOwnerAddressHistory",
  isEnforcement,
  donationBinPropertyOwnerAddressHistoryRouter
);

app.use(
  "/donationBin/donationBinOperatorAddressHistory",
  isEnforcement,
  donationBinOperatorAddressHistoryRouter
);

app.use("/donationBin/addCharity", isEnforcement, addDonationBinCharityRouter);
app.use(
  "/donationBin/editCharity",
  isEnforcement,
  editDonationBinCharityRouter
);

app.use("/donationBin/addPropertyOwner", isEnforcement, addPropertyOwnerRouter);
app.use(
  "/donationBin/editPropertyOwner",
  isEnforcement,
  editPropertyOwnerRouter
);

app.use(
  "/donationBin/addOperator",
  isEnforcement,
  addDonationBinOperatorRouter
);
app.use(
  "/donationBin/editOperator",
  isEnforcement,
  editDonationBinOperatorRouter
);

app.use("/donationBin/bins", isEnforcement, binsRoute);
app.use("/donationBin/addDonationBin", isEnforcement, addDonationBinRouter);
app.use("/donationBin/editDonationBin", isEnforcement, editDonationBinRouter);

app.use("/donationBin/donationBinHistory", donationBinHistoryRoute);

/* Hawker & Peddler related routes */
app.use("/hawkerPeddler", isEnforcement, hawkerPeddlerRoute);

app.use(
  "/hawkerPeddler/businessAddressHistory",
  isEnforcement,
  hawkerPeddlerBusinessAddressHistoryRoute
);

app.use(
  "/hawkerPeddler/propertyOwnerAddressHistory",
  isEnforcement,
  hawkerPeddlerPropertyOwnerAddressHistoryRoute
);

app.use(
  "/hawkerPeddler/applicantAddressHistory",
  isEnforcement,
  hawkerPeddlerApplicantAddressHistoryRoute
);

app.use(
  "/hawkerPeddler/addPropertyOwner",
  isEnforcement,
  hawkerPeddlerAddPropertyOwnerRoute
);
app.use(
  "/hawkerPeddler/editPropertyOwner",
  isEnforcement,
  hawkerPeddlerEditPropertyOwnerRoute
);

app.use(
  "/hawkerPeddler/addOperator",
  isEnforcement,
  hawkerPeddlerAddOperatorRoute
);
app.use(
  "/hawkerPeddler/editOperator",
  isEnforcement,
  hawkerPeddlerEditOperatorRoute
);

app.use("/hawkerPeddler/business", isEnforcement, hawkerPeddlerBusinessRoute);

app.use(
  "/hawkerPeddler/operatorHistory",
  isEnforcement,
  hawkerPeddlerOperatorHistoryRoute
);

app.use(
  "/hawkerPeddler/addBusiness",
  isEnforcement,
  hawkerPeddlerAddBusinessRoute
);

app.use(
  "/hawkerPeddler/editBusiness",
  isEnforcement,
  hawkerPeddlerEditBusinessRoute
);

/* kennel related routes */
app.use("/kennels", isEnforcement, kennelsRoute);

app.use("/kennels/kennelHistory", isEnforcement, kennelHistoryRoute);

app.use(
  "/kennels/kennelAddressHistory",
  isEnforcement,
  kennelAddressHistoryRoute
);

app.use(
  "/kennels/kennelOwnerAddressHistory",
  isEnforcement,
  kennelOwnerAddressHistoryRoute
);

app.use(
  "/kennels/kennelPropertyOwnerAddressHistory",
  isEnforcement,
  kennelPropertyOwnerAddressHistoryRoute
);

app.use("/kennels/kennel", isEnforcement, kennelRoute);
app.use("/kennels/addKennel", isEnforcement, addKennelRoute);
app.use("/kennels/editKennel", isEnforcement, editKennelRoute);

app.use(
  "/kennels/addPropertyOwner",
  isEnforcement,
  addKennelPropertyOwnerRoute
);
app.use(
  "/kennels/editPropertyOwner",
  isEnforcement,
  editKennelPropertyOwnerRoute
);

app.use("/kennels/addKennelOwner", isEnforcement, addKennelOwnerRoute);
app.use("/kennels/editKennelOwner", isEnforcement, editKennelOwnerRoute);

/* Liquor License related routes */
app.use("/liquor", isEnforcement, liquorRoute);

app.use(
  "/liquor/businessAddressHistory",
  isEnforcement,
  liquorBusinessAddressHistoryRoute
);

app.use("/liquor/addBusiness", isEnforcement, addLiquorBusinessRoute);
app.use("/liquor/editBusiness", isEnforcement, editLiquorBusinessRoute);

/* Refreshment Vehicle related routes */
app.use("/refreshmentVehicles", isEnforcement, refreshmentVehicleRoute);

app.use(
  "/refreshmentVehicles/vehicleHistory",
  isEnforcement,
  vehicleHistoryRoute
);

app.use(
  "/refreshmentVehicles/vehicleOperatorAddressHistory",
  isEnforcement,
  refreshmentVehicleOperatorAddressHistoryRoute
);

app.use(
  "/refreshmentVehicles/vehicleOwnerAddressHistory",
  isEnforcement,
  refreshmentVehicleOwnerAddressHistoryRoute
);

app.use(
  "/refreshmentVehicles/vehiclePropertyOwnerAddressHistory",
  isEnforcement,
  refreshmentVehiclePropertyOwnerAddressHistoryRoute
);

app.use(
  "/refreshmentVehicles/addVehicle",
  isEnforcement,
  addRefreshmentVehicleRoute
);
app.use(
  "/refreshmentVehicles/editVehicle",
  isEnforcement,
  editRefreshmentVehicleRoute
);

app.use("/refreshmentVehicles/vehicle", isEnforcement, vehicleRoute);

app.use(
  "/refreshmentVehicles/addPropertyOwner",
  isEnforcement,
  addRefreshmentVehiclePropertyOwner
);
app.use(
  "/refreshmentVehicles/editPropertyOwner",
  isEnforcement,
  editRefreshmentVehiclePropertyOwner
);

app.use(
  "/refreshmentVehicles/addVehicleOwner",
  isEnforcement,
  addRefreshmentVehicleOwner
);
app.use(
  "/refreshmentVehicles/editVehicleOwner",
  isEnforcement,
  editRefreshmentVehicleOwner
);

app.use(
  "/refreshmentVehicles/addVehicleOperator",
  isEnforcement,
  addRefreshmentVehicleOperator
);
app.use(
  "/refreshmentVehicles/editVehicleOperator",
  isEnforcement,
  editRefreshmentVehicleOperator
);

/* POA Matters related routes */
app.use("/poaMatters", isEnforcement, poaMattersRoute);

app.use("/poaMatters/addPoaMatter", isEnforcement, addPoaMatterRoute);
app.use("/poaMatters/editPoaMatter", isEnforcement, editPoaMatterRoute);

app.use("/poaMatters/addTrialDates", isEnforcement, addAdditionalTrialDates);

/* Taxi related routes */
app.use("/taxiLicenses", isEnforcement, taxiLicenseRoute);

app.use(
  "/taxiLicenses/brokerAddressHistory",
  isEnforcement,
  taxiLicenseBrokerAddressHistoryRoute
);

app.use(
  "/taxiLicenses/driverAddressHistory",
  isEnforcement,
  taxiLicenseDriverAddressHistoryRoute
);

app.use(
  "/taxiLicenses/plateOwnerAddressHistory",
  isEnforcement,
  taxiLicensePlateOwnerAddressHistoryRoute
);

app.use("/taxiLicenses/addBroker", isEnforcement, addTaxiBrokerRoute);
app.use("/taxiLicenses/editBroker", isEnforcement, editTaxiBrokerRoute);

app.use("/taxiLicenses/broker", isEnforcement, taxiBrokerRoute);

app.use("/taxiLicenses/brokerHistory", isEnforcement, taxiBrokerHistoryRoute);
app.use("/taxiLicenses/driverHistory", isEnforcement, taxiDriverHistoryRoute);
app.use("/taxiLicenses/plateHistory", isEnforcement, taxiPlateHistoryRoute);

app.use("/taxiLicenses/addDriver", isEnforcement, addTaxiDriverRoute);
app.use("/taxiLicenses/editDriver", isEnforcement, editTaxiDriverRoute);

app.use("/taxiLicenses/addPlate", isEnforcement, addTaxiPlateRoute);
app.use("/taxiLicenses/editPlate", isEnforcement, editTaxiPlateRoute);

// setup a CRON job to email me the log file daily at 4:30pm.
var job = new CronJob(
  "0 2 * * *",
  function () {
    fs.readFile("logs/errors.log", (err, data) => {
      if (err) {
        console.log("Error!");
      }

      if (data) {
        // get current date.
        var date = new Date();

        const msg = {
          to: process.env.SEND_GRID_TO,
          from: process.env.SEND_GRID_FROM,
          subject: "Daily Log File - " + date.toDateString(),
          text: "Daily log file for BWG-Licenses app",
          html: "<br><strong>Log Report for BWG-Licenses</strong><br>",
          attachments: [
            {
              content: data.toString("base64"),
              filename: "errors.log",
              type: "text",
              disposition: "attachment",
              content_id: "logfile",
            },
          ],
        };
        sgMail.send(msg).catch((error) => {
          console.error(error);
        });
      }
    });
  },
  null,
  true,
  "America/Toronto"
);

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
