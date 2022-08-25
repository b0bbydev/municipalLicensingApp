var express = require("express");
var router = express.Router();
// models.
const Dropdown = require("../../models/dropdownManager/dropdown");
const StreetClosurePermit = require("../../models/streetClosurePermits/streetClosurePermit");
const StreetClosureContact = require("../../models/streetClosurePermits/streetClosureContact");
const StreetClosureContactAddress = require("../../models/streetClosurePermits/streetClosureContactAddress");
const StreetClosureCoordinator = require("../../models/streetClosurePermits/streetClosureCoordinator");
const StreetClosureCoordinatorAddress = require("../../models/streetClosurePermits/streetClosureCoordinatorAddress");
// helpers.
var funcHelpers = require("../../config/funcHelpers");
// express-validate.
const { body, validationResult } = require("express-validator");

/* GET /streetClosurePermit/addPermit */
router.get("/", async (req, res, next) => {
  // check if there's an error message in the session
  let messages = req.session.messages || [];
  // clear session messages
  req.session.messages = [];

  // get streets.
  var streets = await Dropdown.findAll({
    where: {
      dropdownFormID: 13, // streets
    },
  });

  return res.render("streetClosurePermit/addPermit", {
    title: "BWG | Add Street Closure Permit",
    message: messages,
    email: req.session.email,
    auth: req.session.auth, // authorization.
    streets: streets,
  });
});

/* POST /streetClosurePermit/addPermit */
router.post(
  "/",
  body("sponser")
    .if(body("sponser").notEmpty())
    .matches(/^[^%<>^$\\;!{}?]+$/)
    .withMessage("Invalid Event Sponser Entry!")
    .trim(),
  body("permitNumber")
    .if(body("permitNumber").notEmpty())
    .matches(/^[^%<>^$\\;!{}?]+$/)
    .withMessage("Invalid Permit Number Entry!")
    .trim(),
  body("closureLocation")
    .if(body("closureLocation").notEmpty())
    .matches(/^[^%<>^$\\;!{}?]+$/)
    .withMessage("Invalid Closure Location Entry!")
    .trim(),
  body("closureTime")
    .if(body("closureTime").notEmpty())
    .matches(/^[^%<>^$\\;!{}?]+$/)
    .withMessage("Invalid Closure Time Entry!")
    .trim(),
  body("estimatedAttendance")
    .if(body("estimatedAttendance").notEmpty())
    .matches(/^[^%<>^$\\;!{}?]+$/)
    .withMessage("Invalid Estimated Attendance Entry!")
    .trim(),
  body("description")
    .if(body("description").notEmpty())
    .matches(/^[^%<>^\/\\;!{}?]+$/)
    .withMessage("Invalid Description Entry!")
    .trim(),
  body("cleanupPlan")
    .if(body("cleanupPlan").notEmpty())
    .matches(/^[^%<>^\/\\;!{}?]+$/)
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
      // insert streetClosurePermit info.
      StreetClosurePermit.create({
        sponser: req.body.sponser,
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
          StreetClosurePermit.findOne({
            where: {
              permitNumber: req.body.permitNumber,
            },
          }).then((results) => {
            // insert streetClosureCoordinator info.
            StreetClosureCoordinator.create(
              {
                coordinatorName: req.body.coordinatorName,
                coordinatorPhone: req.body.coordinatorPhone,
                coordinatorEmail: req.body.coordinatorEmail,
                // use streetClosurePermitID from last insert.
                streetClosurePermitID: results.streetClosurePermitID,
                streetClosureCoordinatorAddresses: [
                  {
                    streetNumber: req.body.coordinatorStreetNumber,
                    streetName: req.body.coordinatorStreetName,
                    town: req.body.coordinatorTown,
                    postalCode: req.body.coordinatorPostalCode,
                    streetClosurePermitID: results.streetClosurePermitID,
                  },
                ],
              },
              {
                include: [StreetClosureCoordinatorAddress],
              }
            );
            // insert streetClosureContact info.
            StreetClosureContact.create(
              {
                everydayContactName: req.body.everydayContactName,
                everydayContactPhone: req.body.everydayContactPhone,
                everydayContactEmail: req.body.everydayContactEmail,
                // use streetClosurePermitID from last insert.
                streetClosurePermitID: results.streetClosurePermitID,
                streetClosureContactAddresses: [
                  {
                    streetNumber: req.body.contactStreetNumber,
                    streetName: req.body.contactStreetName,
                    town: req.body.contactTown,
                    postalCode: req.body.contactPostalCode,
                    streetClosurePermitID: results.streetClosurePermitID,
                  },
                ],
              },
              {
                include: [StreetClosureContactAddress],
              }
            );
          });
        })
        .then(() => {
          return res.redirect("/streetClosurePermit");
        })
        .catch((err) => {
          return res.render("streetClosurePermit/addPermit", {
            title: "BWG | Add Street Closure Permit",
            message: "Page Error! Possible duplicate permit number.",
            auth: req.session.auth, // authorization.
            formData: {
              // coordinator.
              coordinatorName: req.body.coordinatorName,
              coordinatorPhone: req.body.coordinatorPhone,
              coordinatorEmail: req.body.coordinatorEmail,
              // coordinator address.
              coordinatorStreetNumber: req.body.streetNumber,
              coordinatorStreetName: req.body.streetName,
              coordinatorTown: req.body.town,
              coordinatorPostalCode: req.body.postalCode,
              // contact
              everydayContactName: req.body.everydayContactName,
              everydayContactPhone: req.body.everydayContactPhone,
              everydayContactEmail: req.body.everydayContactEmail,
              // contact address.
              contactStreetNumber: req.body.streetNumber,
              contactStreetName: req.body.streetName,
              contactTown: req.body.town,
              contactPostalCode: req.body.postalCode,
              // permit info.
              sponser: req.body.sponser,
              permitNumber: req.body.permitNumber,
              issueDate: req.body.issueDate,
              closureLocation: req.body.closureLocation,
              closureDate: req.body.closureDate,
              closureTime: req.body.closureTime,
              estimatedAttendance: req.body.estimatedAttendance,
              alcoholServed: req.body.alcoholServed,
              noiseExemption: req.body.noiseExemption,
              description: req.body.description,
              cleanupPlan: req.body.cleanupPlan,
            },
          });
        });
    }
  }
);

module.exports = router;
