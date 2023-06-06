var express = require("express");
var router = express.Router();
// models.
const Dropdown = require("../../models/dropdownManager/dropdown");
const TaxiBroker = require("../../models/taxiLicenses/taxiBroker");
const TaxiBrokerAddress = require("../../models/taxiLicenses/taxiBrokerAddress");
// helper.
const funcHelpers = require("../../config/funcHelpers");
// express-validate.
const { body, validationResult } = require("express-validator");

/* GET /taxiLicenses/editBroker/:id */
router.get("/:id", async (req, res, next) => {
  // check if there's an error message in the session
  let messages = req.session.messages || [];
  // clear session messages
  req.session.messages = [];

  // get streets.
  var streets = await Dropdown.findAll({
    where: {
      dropdownFormID: 13, // streets
    },
    order: [["dropdownValue", "ASC"]],
  });

  TaxiBroker.findOne({
    where: {
      taxiBrokerID: req.params.id,
    },
    include: [
      {
        model: TaxiBrokerAddress,
      },
    ],
  })
    .then((results) => {
      return res.render("taxiLicenses/editBroker", {
        title: "BWG | Edit Taxi Broker",
        message: messages,
        email: req.session.email,
        auth: req.session.auth, // authorization.
        streets: streets,
        // populate input fields with existing values.
        formData: {
          ownerName: results.ownerName,
          companyName: results.companyName,
          phoneNumber: results.phoneNumber,
          licenseNumber: results.licenseNumber,
          issueDate: results.issueDate,
          expiryDate: results.expiryDate,
          policeVSC: results.policeVSC,
          citizenship: results.citizenship,
          photoID: results.photoID,
          driversAbstract: results.driversAbstract,
          certificateOfInsurance: results.certificateOfInsurance,
          zoningApproval: results.zoningApproval,
          notes: results.notes,
          streetNumber: results.taxiBrokerAddresses[0].streetNumber,
          streetName: results.taxiBrokerAddresses[0].streetName,
          town: results.taxiBrokerAddresses[0].town,
          postalCode: results.taxiBrokerAddresses[0].postalCode,
        },
      });
    })
    .catch((err) => {
      return res.render("taxiLicenses/editBroker", {
        title: "BWG | Edit Taxi Broker",
        message: "Page Error!",
        auth: req.session.auth, // authorization.
      });
    });
});

/* POST /taxiLicenses/editBroker/:id */
router.post(
  "/:id",
  body("ownerName")
    .if(body("ownerName").notEmpty())
    .matches(/^[^%<>^$\\;!{}?]+$/)
    .withMessage("Invalid Owner Name Entry!")
    .trim(),
  body("companyName")
    .if(body("companyName").notEmpty())
    .matches(/^[^%<>^$\\;!{}?]+$/)
    .withMessage("Invalid Company Name Entry!")
    .trim(),
  body("phoneNumber")
    .if(body("phoneNumber").notEmpty())
    .matches(/^[^%<>^$\\;!{}?]+$/)
    .withMessage("Invalid Phone Number Entry!")
    .trim(),
  body("licenseNumber")
    .if(body("licenseNumber").notEmpty())
    .matches(/^[^%<>^$\\;!{}?]+$/)
    .withMessage("Invalid License Number Entry!")
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
  body("notes")
    .if(body("notes").notEmpty())
    .matches(/^[^%<>^\/\\;!{}?]+$/)
    .withMessage("Invalid Notes Entry!")
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
      order: [["dropdownValue", "ASC"]],
    });

    // if errors is NOT empty (if there are errors...).
    if (!errors.isEmpty()) {
      return res.render("taxiLicenses/editBroker", {
        title: "BWG | Edit Taxi Broker",
        message: errorArray[0].msg,
        email: req.session.email,
        auth: req.session.auth, // authorization.
        streets: streets,
        // save form values if submission is unsuccessful.
        formData: {
          ownerName: req.body.ownerName,
          companyName: req.body.companyName,
          phoneNumber: req.body.phoneNumber,
          licenseNumber: req.body.licenseNumber,
          issueDate: req.body.issueDate,
          expiryDate: req.body.expiryDate,
          policeVSC: req.body.policeVSC,
          citizenship: req.body.citizenship,
          photoID: req.body.photoID,
          driversAbstract: req.body.driversAbstract,
          certificateOfInsurance: req.body.certificateOfInsurance,
          zoningApproval: req.body.zoningApproval,
          notes: req.body.notes,
          streetNumber: req.body.streetNumber,
          streetName: req.body.streetName,
          town: req.body.town,
          postalCode: req.body.postalCode,
        },
      });
    } else {
      /* begin check for ONLY updating data when a value has changed. */
      // create empty objects to hold data.
      let currentData = {};
      let newData = {};

      // get current data.
      TaxiBroker.findOne({
        where: {
          taxiBrokerID: req.params.id,
        },
      })
        .then((results) => {
          // put the CURRENT data into an object.
          currentData = {
            ownerName: results.dataValues.ownerName,
            companyName: results.dataValues.companyName,
            phoneNumber: results.dataValues.phoneNumber,
            licenseNumber: results.dataValues.licenseNumber,
            issueDate: results.dataValues.issueDate,
            expiryDate: results.dataValues.expiryDate,
            policeVSC: results.dataValues.policeVSC,
            citizenship: results.dataValues.citizenship,
            photoID: results.dataValues.photoID,
            driversAbstract: results.dataValues.driversAbstract,
            certificateOfInsurance: results.dataValues.certificateOfInsurance,
            zoningApproval: results.dataValues.zoningApproval,
            notes: results.dataValues.notes,
          };

          // put the NEW data into an object.
          // fixEmptyValue() in this case will replace any 'undefined' values with null.
          // which is required when comparing objects as null != defined, making them techinically different.
          newData = {
            ownerName: req.body.ownerName,
            companyName: req.body.companyName,
            phoneNumber: req.body.phoneNumber,
            licenseNumber: req.body.licenseNumber,
            issueDate: funcHelpers.fixEmptyValue(req.body.issueDate),
            expiryDate: funcHelpers.fixEmptyValue(req.body.expiryDate),
            policeVSC: funcHelpers.fixEmptyValue(req.body.policeVSC),
            citizenship: funcHelpers.fixEmptyValue(req.body.citizenship),
            photoID: funcHelpers.fixEmptyValue(req.body.photoID),
            driversAbstract: funcHelpers.fixEmptyValue(
              req.body.driversAbstract
            ),
            certificateOfInsurance: funcHelpers.fixEmptyValue(
              req.body.certificateOfInsurance
            ),
            zoningApproval: funcHelpers.fixEmptyValue(req.body.zoningApproval),
            notes: req.body.notes,
          };

          // compare the two objects to check if they contain equal properties. If NOT (false), then proceed with update.
          if (!funcHelpers.areObjectsEqual(currentData, newData)) {
            TaxiBroker.update(
              {
                ownerName: req.body.ownerName,
                companyName: req.body.companyName,
                phoneNumber: req.body.phoneNumber,
                licenseNumber: req.body.licenseNumber,
                issueDate: funcHelpers.fixEmptyValue(req.body.issueDate),
                expiryDate: funcHelpers.fixEmptyValue(req.body.expiryDate),
                policeVSC: req.body.policeVSC,
                citizenship: req.body.citizenship,
                photoID: req.body.photoID,
                driversAbstract: req.body.driversAbstract,
                certificateOfInsurance: req.body.certificateOfInsurance,
                zoningApproval: req.body.zoningApproval,
                notes: req.body.notes,
              },
              {
                where: {
                  taxiBrokerID: req.params.id,
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
          TaxiBrokerAddress.findOne({
            where: {
              taxiBrokerID: req.params.id,
            },
          }).then((results) => {
            currentData = {
              streetNumber: results.streetNumber,
              streetName: results.streetName,
              town: results.town,
              postalCode: results.postalCode,
            };

            // put the NEW data into an object.
            newData = {
              streetNumber: parseInt(req.body.streetNumber),
              streetName: req.body.streetName,
              town: req.body.town,
              postalCode: req.body.postalCode,
            };

            // compare the two objects to check if they contain equal properties. If NOT, then proceed with update.
            if (!funcHelpers.areObjectsEqual(currentData, newData)) {
              // update address.
              TaxiBrokerAddress.update(
                {
                  streetNumber: req.body.streetNumber,
                  streetName: req.body.streetName,
                  town: req.body.town,
                  postalCode: req.body.postalCode,
                },
                {
                  where: {
                    taxiBrokerID: req.params.id,
                  },
                }
              );
            }
          });
        })
        .then(() => {
          return res.redirect("/taxiLicenses");
        })
        .catch((err) => {
          return res.render("taxiLicenses/editBroker", {
            title: "BWG | Edit Taxi Broker",
            message: "Page Error!",
            auth: req.session.auth, // authorization.
          });
        });
    }
  }
);

module.exports = router;
