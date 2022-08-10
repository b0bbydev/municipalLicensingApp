var express = require("express");
var router = express.Router();
// models.
const StreetClosurePermit = require("../../models/streetClosurePermits/streetClosurePermit");
// helpers.
var funcHelpers = require("../../config/funcHelpers");
// express-validate.
const { body, validationResult } = require("express-validator");

/* GET /streetClosurePermit/addPermit */
router.get("/", function (req, res, next) {
  // check if there's an error message in the session
  let messages = req.session.messages || [];
  // clear session messages
  req.session.messages = [];

  return res.render("streetClosurePermit/addPermit", {
    title: "BWG | Add Street Closure Permit",
    message: messages,
    email: req.session.email,
    auth: req.session.auth, // authorization.
  });
});

/* POST /streetClosurePermit/addPermit */
router.post(
  "/",
  body("coordinatorName")
    .notEmpty()
    .matches(/^[^%<>^$\/\\;!{}?]+$/)
    .withMessage("Invalid Coordinator Name Entry!")
    .trim(),
  body("coordinatorPhone")
    .if(body("coordinatorPhone").notEmpty())
    .matches(/^[^%<>^$\/\\;!{}?]+$/)
    .withMessage("Invalid Coordinator Phone Number Entry!")
    .trim(),
  body("coordinatorEmail")
    .if(body("coordinatorEmail").notEmpty())
    .isEmail()
    .withMessage("Invalid Coordinator Email Entry!")
    .trim(),
  body("sponser")
    .if(body("sponser").notEmpty())
    .matches(/^[^%<>^$\/\\;!{}?]+$/)
    .withMessage("Invalid Event Sponser Entry!")
    .trim(),
  body("everydayContactName")
    .if(body("everydayContactName").notEmpty())
    .matches(/^[^%<>^$\/\\;!{}?]+$/)
    .withMessage("Invalid Everyday Contact Name Entry!")
    .trim(),
  body("everydayContactPhone")
    .if(body("everydayContactPhone").notEmpty())
    .matches(/^[^%<>^$\/\\;!{}?]+$/)
    .withMessage("Invalid Everyday Contact Phone Number Entry!")
    .trim(),
  body("everydayContactEmail")
    .if(body("everydayContactEmail").notEmpty())
    .isEmail()
    .withMessage("Invalid Everyday Contact Email Entry!")
    .trim(),
  body("permitNumber")
    .if(body("permitNumber").notEmpty())
    .matches(/^[^%<>^$\/\\;!{}?]+$/)
    .withMessage("Invalid Permit Number Entry!")
    .trim(),
  body("closureLocation")
    .if(body("closureLocation").notEmpty())
    .matches(/^[^%<>^$\/\\;!{}?]+$/)
    .withMessage("Invalid Closure Location Entry!")
    .trim(),
  body("closureTime")
    .if(body("closureTime").notEmpty())
    .matches(/^[^%<>^$\/\\;!{}?]+$/)
    .withMessage("Invalid Closure Time Entry!")
    .trim(),
  body("estimatedAttendance")
    .if(body("estimatedAttendance").notEmpty())
    .matches(/^[^%<>^$\/\\;!{}?]+$/)
    .withMessage("Invalid Estimated Attendance Entry!")
    .trim(),
  body("description")
    .if(body("description").notEmpty())
    .matches(/^[\r\na-zA-Z0-9\/\-,.:"' ]+/)
    .withMessage("Invalid Description Entry!")
    .trim(),
  body("cleanupPlan")
    .if(body("cleanupPlan").notEmpty())
    .matches(/^[\r\na-zA-Z0-9\/\-,.:"' ]+/)
    .withMessage("Invalid Cleanup Plan Entry!")
    .trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // use built-in array() to convert Result object to array for custom error messages.
    var errorArray = errors.array();

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("streetClosurePermit/addPermit", {
        title: "BWG | Add Street Closure Permit",
        message: errorArray[0].msg,
        email: req.session.email,
        auth: req.session.auth, // authorization.
      });
    } else {
      // create dropdown form.
      StreetClosurePermit.create({
        coordinatorName: req.body.coordinatorName,
        coordinatorPhone: req.body.coordinatorPhone,
        coordinatorEmail: req.body.coordinatorEmail,
        sponser: req.body.sponser,
        everydayContactName: req.body.everydayContactName,
        everydayContactPhone: req.body.everydayContactPhone,
        everydayContactEmail: req.body.everydayContactEmail,
        permitNumber: req.body.permitNumber,
        issueDate: funcHelpers.fixEmptyValue(req.body.issueDate),
        closureLocation: req.body.closureLocation,
        closureDate: funcHelpers.fixEmptyValue(req.body.closureDate),
        closureTime: req.body.closureTime,
        estimatedAttendance: funcHelpers.fixEmptyValue(
          req.body.estimatedAttendance
        ),
        alcoholServed: req.body.alcoholServed,
        noiseExemption: req.body.noiseExemption,
        description: req.body.description,
        cleanupPlan: req.body.cleanupPlan,
      })
        .then(() => {
          return res.redirect("/streetClosurePermit");
        })
        .catch((err) => {
          return res.render("streetClosurePermit/addPermit", {
            title: "BWG | Add Street Closure Permit",
            message: "Page Error!",
          });
        });
    }
  }
);

module.exports = router;
