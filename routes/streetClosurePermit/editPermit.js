var express = require("express");
var router = express.Router();
// models.
const StreetClosurePermit = require("../../models/streetClosurePermits/streetClosurePermit");
// helpers.
var funcHelpers = require("../../config/funcHelpers");
// express-validate.
const { body, param, validationResult } = require("express-validator");

/* GET /streetClosurePermit/editPermit/:id */
router.get(
  "/:id",
  param("id").matches(/^\d+$/).trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...).
    if (!errors.isEmpty()) {
      return res.render("streetClosurePermit/editPermit", {
        title: "BWG | Edit Street Closure Permit",
        message: "Page Error!",
        email: req.session.email,
        auth: req.session.auth, // authorization.
      });
    } else {
      // check if there's an error message in the session
      let messages = req.session.messages || [];
      // clear session messages
      req.session.messages = [];

      // for populating input fields with existing values.
      StreetClosurePermit.findOne({
        where: {
          streetClosurePermitID: req.params.id,
        },
      }).then((results) => {
        return res.render("streetClosurePermit/editPermit", {
          title: "BWG | Edit Street Closure Permit",
          errorMessages: messages,
          email: req.session.email,
          auth: req.session.auth, // authorization.
          // get values for input fields.
          permitInfo: {
            coordinatorName: results.coordinatorName,
            coordinatorPhone: results.coordinatorPhone,
            coordinatorEmail: results.coordinatorEmail,
            sponser: results.sponser,
            everydayContactName: results.everydayContactName,
            everydayContactPhone: results.everydayContactPhone,
            everydayContactEmail: results.everydayContactEmail,
            permitNumber: results.permitNumber,
            issueDate: results.issueDate,
            closureLocation: results.closureLocation,
            closureDate: results.closureDate,
            closureTime: results.closureTime,
            estimatedAttendance: results.estimatedAttendance,
            alcoholServed: results.alcoholServed,
            noiseExemption: results.noiseExemption,
            description: results.description,
            cleanupPlan: results.cleanupPlan,
          },
        });
      });
    }
  }
);

/* POST /streetClosurePermit/editPermit/:id */
router.post(
  "/:id",
  body("coordinatorName")
    .notEmpty()
    .matches(/^[a-zA-Z\/\- ]*$/)
    .withMessage("Invalid Coordinator Name Entry!")
    .trim(),
  body("coordinatorPhone")
    .if(body("coordinatorPhone").notEmpty())
    .matches(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/)
    .withMessage("Invalid Coordinator Phone Number Entry!")
    .trim(),
  body("coordinatorEmail")
    .if(body("coordinatorEmail").notEmpty())
    .isEmail()
    .withMessage("Invalid Coordinator Email Entry!")
    .trim(),
  body("sponser")
    .if(body("sponser").notEmpty())
    .matches(/^[a-zA-Z0-9\/\-,.:' ]*$/)
    .withMessage("Invalid Event Sponser Entry!")
    .trim(),
  body("everydayContactName")
    .if(body("everydayContactName").notEmpty())
    .matches(/^[a-zA-Z\/\- ]*$/)
    .withMessage("Invalid Everyday Contact Name Entry!")
    .trim(),
  body("everydayContactPhone")
    .if(body("everydayContactPhone").notEmpty())
    .matches(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/)
    .withMessage("Invalid Everyday Contact Phone Number Entry!")
    .trim(),
  body("everydayContactEmail")
    .if(body("everydayContactEmail").notEmpty())
    .isEmail()
    .withMessage("Invalid Everyday Contact Email Entry!")
    .trim(),
  body("permitNumber")
    .if(body("permitNumber").notEmpty())
    .matches(/^[0-9]*$/)
    .withMessage("Invalid Permit Number Entry!")
    .trim(),
  body("closureLocation")
    .if(body("closureLocation").notEmpty())
    .matches(/^[a-zA-Z0-9\/\-,.:"' ]*$/)
    .withMessage("Invalid Closure Location Entry!")
    .trim(),
  body("closureTime")
    .if(body("closureTime").notEmpty())
    .matches(/^[a-zA-Z0-9\/\-,.:"' ]*$/)
    .withMessage("Invalid Closure Time Entry!")
    .trim(),
  body("estimatedAttendance")
    .if(body("estimatedAttendance").notEmpty())
    .matches(/^[0-9]*$/)
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
      return res.render("streetClosurePermit/editPermit", {
        title: "BWG | Edit Street Closure Permit",
        message: errorArray[0].msg,
        email: req.session.email,
        auth: req.session.auth, // authorization.
      });
    } else {
      // create dropdown form.
      StreetClosurePermit.update(
        {
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
        },
        {
          where: {
            streetClosurePermitID: req.params.id,
          },
        }
      )
        .then(res.redirect("/streetClosurePermit"))
        .catch((err) => {
          return res.render("streetClosurePermit/editPermit", {
            title: "BWG | Edit Street Closure Permit",
            message: "Page Error!",
          });
        });
    }
  }
);

module.exports = router;
