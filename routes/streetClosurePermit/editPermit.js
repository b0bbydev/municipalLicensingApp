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

      // get streets.
      var streets = await Dropdown.findAll({
        where: {
          dropdownFormID: 13, // streets
        },
      });

      // for populating input fields with existing values.
      StreetClosurePermit.findOne({
        include: [
          {
            model: StreetClosureContact,
            include: [StreetClosureContactAddress],
          },
          {
            model: StreetClosureCoordinator,
            include: [StreetClosureCoordinatorAddress],
          },
        ],
        where: {
          streetClosurePermitID: req.params.id,
        },
      })
        .then((results) => {
          return res.render("streetClosurePermit/editPermit", {
            title: "BWG | Edit Street Closure Permit",
            message: messages,
            email: req.session.email,
            auth: req.session.auth, // authorization.
            streets: streets,
            // get values for input fields.
            formData: {
              // coordinator.
              coordinatorName:
                results.streetClosureCoordinators[0].coordinatorName,
              coordinatorPhone:
                results.streetClosureCoordinators[0].coordinatorPhone,
              coordinatorEmail:
                results.streetClosureCoordinators[0].coordinatorEmail,
              // coordinator address.
              coordinatorStreetNumber:
                results.streetClosureCoordinators[0]
                  .streetClosureCoordinatorAddresses[0].streetNumber,
              coordinatorStreetName:
                results.streetClosureCoordinators[0]
                  .streetClosureCoordinatorAddresses[0].streetName,
              coordinatorTown:
                results.streetClosureCoordinators[0]
                  .streetClosureCoordinatorAddresses[0].town,
              coordinatorPostalCode:
                results.streetClosureCoordinators[0]
                  .streetClosureCoordinatorAddresses[0].postalCode,
              // contact
              everydayContactName:
                results.streetClosureContacts[0].everydayContactName,
              everydayContactPhone:
                results.streetClosureContacts[0].everydayContactPhone,
              everydayContactEmail:
                results.streetClosureContacts[0].everydayContactEmail,
              // contact address.
              contactStreetNumber:
                results.streetClosureContacts[0]
                  .streetClosureContactAddresses[0].streetNumber,
              contactStreetName:
                results.streetClosureContacts[0]
                  .streetClosureContactAddresses[0].streetName,
              contactTown:
                results.streetClosureContacts[0]
                  .streetClosureContactAddresses[0].town,
              contactPostalCode:
                results.streetClosureContacts[0]
                  .streetClosureContactAddresses[0].postalCode,
              // permit info.
              sponser: results.sponser,
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
        })
        .catch((err) => {
          return res.render("streetClosurePermit/editPermit", {
            title: "BWG | Edit Street Closure Permit",
            message: "Page Error!",
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
      return res.render("streetClosurePermit/editPermit", {
        title: "BWG | Edit Street Closure Permit",
        message: errorArray[0].msg,
        email: req.session.email,
        auth: req.session.auth, // authorization.
      });
    } else {
      StreetClosurePermit.update(
        {
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
        },
        {
          where: {
            streetClosurePermitID: req.params.id,
          },
        }
      )
        .then(() => {
          StreetClosureCoordinator.update(
            {
              coordinatorName: req.body.coordinatorName,
              coordinatorPhone: req.body.coordinatorPhone,
              coordinatorEmail: req.body.coordinatorEmail,
              streetNumber: req.body.coordinatorStreetNumber,
              streetName: req.body.coordinatorStreetName,
              town: req.body.coordinatorTown,
              postalCode: req.body.coordinatorPostalCode,
            },
            {
              where: {
                streetClosurePermitID: req.params.id,
              },
            }
          );
        })
        .then(() => {
          StreetClosureCoordinatorAddress.update(
            {
              streetNumber: req.body.coordinatorStreetNumber,
              streetName: req.body.coordinatorStreetName,
              town: req.body.coordinatorTown,
              postalCode: req.body.coordinatorPostalCode,
            },
            {
              where: {
                streetClosurePermitID: req.params.id,
              },
            }
          );
        })
        .then(() => {
          StreetClosureContact.update(
            {
              everydayContactName: req.body.everydayContactName,
              everydayContactPhone: req.body.everydayContactPhone,
              everydayContactEmail: req.body.everydayContactEmail,
            },
            {
              where: {
                streetClosurePermitID: req.params.id,
              },
            }
          );
        })
        .then(() => {
          StreetClosureContactAddress.update(
            {
              streetNumber: req.body.contactStreetNumber,
              streetName: req.body.contactStreetName,
              town: req.body.contactTown,
              postalCode: req.body.contactPostalCode,
            },
            {
              where: {
                streetClosurePermitID: req.params.id,
              },
            }
          );
        })
        .then(() => {
          return res.redirect("/streetClosurePermit");
        })
        .catch((err) => {
          return res.render("streetClosurePermit/editPermit", {
            title: "BWG | Edit Street Closure Permit",
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
