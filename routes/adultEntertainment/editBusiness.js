var express = require("express");
var router = express.Router();
// models.
const Dropdown = require("../../models/dropdownManager/dropdown");
const Business = require("../../models/adultEntertainment/business");
const BusinessAddress = require("../../models/adultEntertainment/businessAddress");
// helpers.
const funcHelpers = require("../../config/funcHelpers");
// express-validate.
const { body, param, validationResult } = require("express-validator");

/* GET /adultEntertainment/editBusiness */
router.get(
  "/:id",
  param("id").matches(/^\d+$/).trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...).
    if (!errors.isEmpty()) {
      return res.render("adultEntertainment/editBusiness", {
        title: "BWG | Edit Business",
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

      // used to populate edit form fields.
      Business.findOne({
        where: {
          businessID: req.params.id,
        },
        include: [
          {
            model: BusinessAddress,
          },
        ],
      })
        .then((results) => {
          return res.render("adultEntertainment/editBusiness", {
            title: "BWG | Edit Business",
            message: messages,
            email: req.session.email,
            auth: req.session.auth, // authorization.
            streets: streets,
            // values to populate input fields.
            formData: {
              businessName: results.businessName,
              streetNumber: results.businessAddresses[0].streetNumber,
              streetName: results.businessAddresses[0].streetName,
              poBoxAptRR: results.businessAddresses[0].poBoxAptRR,
              postalCode: results.businessAddresses[0].postalCode,
              town: results.businessAddresses[0].town,
              ownerName: results.ownerName,
              contactName: results.contactName,
              contactPhone: results.contactPhone,
              licenseNumber: results.licenseNumber,
              issueDate: results.issueDate,
              expiryDate: results.expiryDate,
              policeVSC: results.policeVSC,
              certificateOfInsurance: results.certificateOfInsurance,
              photoID: results.photoID,
              healthInspection: results.healthInspection,
              zoningClearance: results.zoningClearance,
              feePaid: results.feePaid,
              notes: results.notes,
            },
          });
        })
        .catch((err) => {
          return res.render("adultEntertainment/editBusiness", {
            title: "BWG | Edit Business",
            message: "Page Error!",
            auth: req.session.auth, // authorization.
          });
        });
    }
  }
);

/* POST /adultEntertainment/editBusiness */
router.post(
  "/:id",
  param("id").matches(/^\d+$/).trim(),
  body("businessName")
    .if(body("businessName").notEmpty())
    .matches(/^[^%<>^$\\;!{}?]+$/)
    .withMessage("Invalid Business Name Entry!")
    .trim(),
  body("ownerName")
    .if(body("ownerName").notEmpty())
    .matches(/^[^%<>^$\\;!{}?]+$/)
    .withMessage("Invalid Owner Name Entry!")
    .trim(),
  body("contactName")
    .if(body("contactName").notEmpty())
    .matches(/^[^%<>^$\\;!{}?]+$/)
    .withMessage("Invalid Contact Name Entry!")
    .trim(),
  body("licenseNumber")
    .if(body("licenseNumber").notEmpty())
    .matches(/^[^%<>^$\\;!{}?]+$/)
    .withMessage("Invalid License Number Entry!")
    .trim(),
  body("contactPhone")
    .if(body("contactPhone").notEmpty())
    .matches(/^[^%<>^$\\;!{}?]+$/)
    .withMessage("Invalid Contact Phone Number Entry!")
    .trim(),
  body("streetNumber")
    .if(body("streetNumber").notEmpty())
    .matches(/^[^%<>^$\\;!{}?]+$/)
    .withMessage("Invalid Street Number Entry!")
    .trim(),
  body("streetName")
    .if(body("streetName").notEmpty())
    .matches(/^[^%<>^$\\;!{}?]+$/)
    .withMessage("Invalid Street Name Entry!")
    .trim(),
  body("poBoxAptRR")
    .if(body("poBoxAptRR").notEmpty())
    .matches(/^[^%<>^$\\;!{}?]+$/)
    .withMessage("Invalid PO Box/Apt/RR Entry!")
    .trim(),
  body("town")
    .if(body("town").notEmpty())
    .matches(/^[^%<>^$\\;!{}?]+$/)
    .withMessage("Invalid Town Entry!")
    .trim(),
  body("postalCode")
    .if(body("postalCode").notEmpty())
    .matches(/^[^%<>^$\\;!{}?]+$/)
    .withMessage("Invalid Postal Code Entry!")
    .trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // use built-in array() to convert Result object to array for custom error messages.
    var errorArray = errors.array();

    // get streets.
    var streets = await Dropdown.findAll({
      where: {
        dropdownFormID: 13, // streets
      },
    });

    // if ERRORS in form EXIST.
    if (!errors.isEmpty()) {
      return res.render("adultEntertainment/editBusiness", {
        title: "BWG | Edit Business",
        message: errorArray[0].msg, // custom error message. (should indicate which field has the error.)
        email: req.session.email,
        auth: req.session.auth, // authorization.
        streets: streets,
        // if the form submission is unsuccessful, save their values.
        formData: {
          businessName: req.body.businessName,
          streetNumber: req.body.streetNumber,
          streetName: req.body.streetName,
          poBoxAptRR: req.body.poBoxAptRR,
          town: req.body.town,
          postalCode: req.body.postalCode,
          ownerName: req.body.ownerName,
          contactName: req.body.contactName,
          contactPhone: req.body.contactPhone,
          licenseNumber: req.body.licenseNumber,
          issueDate: req.body.issueDate,
          expiryDate: req.body.expiryDate,
          policeVSC: req.body.policeVSC,
          certificateOfInsurance: req.body.certificateOfInsurance,
          photoID: req.body.photoID,
          healthInspection: req.body.healthInspection,
          zoningClearance: req.body.zoningClearance,
          feePaid: req.body.feePaid,
          notes: req.body.notes,
        },
      });
    } else {
      /* begin check for ONLY updating data when a value has changed. */
      // create empty objects to hold data.
      let currentData = {};
      let newData = {};

      // get current data.
      Business.findOne({
        where: {
          businessID: req.params.id,
        },
      })
        .then((results) => {
          // put the CURRENT data into an object.
          currentData = {
            businessName: results.dataValues.businessName,
            ownerName: results.dataValues.ownerName,
            contactName: results.dataValues.contactName,
            contactPhone: results.dataValues.contactPhone,
            licenseNumber: results.dataValues.licenseNumber,
            issueDate: results.dataValues.issueDate,
            expiryDate: results.dataValues.expiryDate,
            policeVSC: results.dataValues.policeVSC,
            certificateOfInsurance: results.dataValues.certificateOfInsurance,
            photoID: results.dataValues.photoID,
            healthInspection: results.dataValues.healthInspection,
            zoningClearance: results.dataValues.zoningClearance,
            feePaid: results.dataValues.feePaid,
            notes: results.dataValues.notes,
          };

          // put the NEW data into an object.
          // fixEmptyValue() in this case will replace any 'undefined' values with null.
          // which is required when comparing objects as null != defined, making them techinically different.
          newData = {
            businessName: req.body.businessName,
            ownerName: req.body.ownerName,
            contactName: req.body.contactName,
            contactPhone: req.body.contactPhone,
            licenseNumber: req.body.licenseNumber,
            issueDate: funcHelpers.fixEmptyValue(req.body.issueDate),
            expiryDate: funcHelpers.fixEmptyValue(req.body.expiryDate),
            policeVSC: funcHelpers.fixEmptyValue(req.body.policeVSC),
            certificateOfInsurance: funcHelpers.fixEmptyValue(
              req.body.certificateOfInsurance
            ),
            photoID: funcHelpers.fixEmptyValue(req.body.photoID),
            healthInspection: funcHelpers.fixEmptyValue(
              req.body.healthInspection
            ),
            zoningClearance: funcHelpers.fixEmptyValue(
              req.body.zoningClearance
            ),
            feePaid: funcHelpers.fixEmptyValue(req.body.feePaid),
            notes: req.body.notes,
          };

          // compare the two objects to check if they contain equal properties. If NOT (false), then proceed with update.
          if (!funcHelpers.areObjectsEqual(currentData, newData)) {
            // update business.
            Business.update(
              {
                businessName: req.body.businessName,
                ownerName: req.body.ownerName,
                contactName: req.body.contactName,
                contactPhone: req.body.contactPhone,
                licenseNumber: req.body.licenseNumber,
                issueDate: funcHelpers.fixEmptyValue(req.body.issueDate),
                expiryDate: funcHelpers.fixEmptyValue(req.body.expiryDate),
                policeVSC: req.body.policeVSC,
                certificateOfInsurance: req.body.certificateOfInsurance,
                photoID: req.body.photoID,
                healthInspection: req.body.healthInspection,
                zoningClearance: req.body.zoningClearance,
                feePaid: req.body.feePaid,
                notes: req.body.notes,
              },
              {
                where: {
                  businessID: req.params.id,
                },
              }
            );
          }
        })
        .then(() => {
          // create empty objects to hold data.
          let currentData = {};
          let newData = {};

          // get current data.
          Business.findOne({
            where: {
              businessID: req.params.id,
            },
            include: [
              {
                model: BusinessAddress,
              },
            ],
          }).then((results) => {
            // put the CURRENT data into an object.
            currentData = {
              streetNumber:
                results.businessAddresses[0].dataValues.streetNumber,
              streetName: results.businessAddresses[0].dataValues.streetName,
              poBoxAptRR: results.businessAddresses[0].dataValues.poBoxAptRR,
              town: results.businessAddresses[0].dataValues.town,
              postalCode: results.businessAddresses[0].dataValues.postalCode,
            };

            // put the NEW data into an object.
            newData = {
              streetNumber: parseInt(req.body.streetNumber),
              streetName: req.body.streetName,
              poBoxAptRR: req.body.poBoxAptRR,
              town: req.body.town,
              postalCode: req.body.postalCode,
            };

            // compare the two objects to check if they contain equal properties. If NOT, then proceed with update.
            if (!funcHelpers.areObjectsEqual(currentData, newData)) {
              // update business address.
              BusinessAddress.update(
                {
                  streetNumber: req.body.streetNumber,
                  streetName: req.body.streetName,
                  poBoxAptRR: req.body.poBoxAptRR,
                  town: req.body.town,
                  postalCode: req.body.postalCode,
                },
                {
                  where: {
                    businessID: req.params.id,
                  },
                }
              );
            }
          });
        })
        // redirect back to /adultEntertainment.
        .then(() => {
          return res.redirect("/adultEntertainment");
        })
        .catch((err) => {
          return res.render("adultEntertainment/editBusiness", {
            title: "BWG | Edit Business",
            message: "Page Error!",
            auth: req.session.auth, // authorization.
          });
        });
    }
  }
);

module.exports = router;
