var express = require("express");
var router = express.Router();
// models.
const Dropdown = require("../../models/dropdownManager/dropdown");
const TaxiDriver = require("../../models/taxiLicenses/taxiDriver");
const TaxiDriverAddress = require("../../models/taxiLicenses/taxiDriverAddress");
// helper.
const funcHelpers = require("../../config/funcHelpers");
// express-validate.
const { body, validationResult } = require("express-validator");

/* GET /taxiLicenses/editDriver/:id */
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
  // get cab companies.
  var cabCompanies = await Dropdown.findAll({
    where: {
      dropdownFormID: 30, // cab companies
    },
  });

  TaxiDriver.findOne({
    where: {
      taxiDriverID: req.params.id,
    },
    include: [
      {
        model: TaxiDriverAddress,
      },
    ],
  })
    .then((results) => {
      return res.render("taxiLicenses/editDriver", {
        title: "BWG | Edit Taxi Driver",
        message: messages,
        email: req.session.email,
        auth: req.session.auth, // authorization.
        streets: streets,
        cabCompanies: cabCompanies,
        // populate input fields with existing values.
        formData: {
          firstName: results.firstName,
          lastName: results.lastName,
          phoneNumber: results.phoneNumber,
          cabCompany: results.cabCompany,
          issueDate: results.issueDate,
          expiryDate: results.expiryDate,
          policeVSC: results.policeVSC,
          citizenship: results.citizenship,
          photoID: results.photoID,
          driversAbstract: results.driversAbstract,
          notes: results.notes,
          streetNumber: results.taxiDriverAddresses[0].streetNumber,
          streetName: results.taxiDriverAddresses[0].streetName,
          town: results.taxiDriverAddresses[0].town,
          postalCode: results.taxiDriverAddresses[0].postalCode,
        },
      });
    })
    .catch((err) => {
      return res.render("taxiLicenses/editDriver", {
        title: "BWG | Edit Taxi Driver",
        message: "Page Error!",
        auth: req.session.auth, // authorization.
      });
    });
});

/* POST /taxiLicenses/editDriver/:id */
router.post(
  "/:id",
  body("firstName")
    .if(body("firstName").notEmpty())
    .matches(/^[^%<>^$\\;!{}?]+$/)
    .withMessage("Invalid First Name Entry!")
    .trim(),
  body("lastName")
    .if(body("lastName").notEmpty())
    .matches(/^[^%<>^$\\;!{}?]+$/)
    .withMessage("Invalid Last Name Entry!")
    .trim(),
  body("phoneNumber")
    .if(body("phoneNumber").notEmpty())
    .matches(/^[^%<>^$\\;!{}?]+$/)
    .withMessage("Invalid Phone Number Entry!")
    .trim(),
  body("streetName")
    .if(body("streetName").notEmpty())
    .matches(/^[^%<>^$\\;!{}?]+$/)
    .withMessage("Invalid Street Name Entry!")
    .trim(),
  body("streetNumber")
    .if(body("streetNumber").notEmpty())
    .matches(/^[^%<>^$\\;!{}?]+$/)
    .withMessage("Invalid Street Number Entry!")
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
    // get cab companies.
    var cabCompanies = await Dropdown.findAll({
      where: {
        dropdownFormID: 30, // cab companies
      },
    });

    // if errors is NOT empty (if there are errors...).
    if (!errors.isEmpty()) {
      return res.render("taxiLicenses/editDriver", {
        title: "BWG | Edit Taxi Driver",
        message: errorArray[0].msg,
        email: req.session.email,
        auth: req.session.auth, // authorization.
        streets: streets,
        cabCompanies: cabCompanies,
        // save form values if submission is unsuccessful.
        formData: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          phoneNumber: req.body.phoneNumber,
          cabCompany: req.body.cabCompany,
          issueDate: req.body.issueDate,
          expiryDate: req.body.expiryDate,
          policeVSC: req.body.policeVSC,
          citizenship: req.body.citizenship,
          photoID: req.body.photoID,
          driversAbstract: req.body.driversAbstract,
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
      TaxiDriver.findOne({
        where: {
          taxiDriverID: req.params.id,
        },
      })
        .then((results) => {
          // put the CURRENT data into an object.
          currentData = {
            firstName: results.dataValues.firstName,
            lastName: results.dataValues.lastName,
            phoneNumber: results.dataValues.phoneNumber,
            cabCompany: results.dataValues.cabCompany,
            issueDate: results.dataValues.issueDate,
            expiryDate: results.dataValues.expiryDate,
            policeVSC: results.dataValues.policeVSC,
            citizenship: results.dataValues.citizenship,
            photoID: results.dataValues.photoID,
            driversAbstract: results.dataValues.driversAbstract,
            notes: results.dataValues.notes,
          };

          // put the NEW data into an object.
          // fixEmptyValue() in this case will replace any 'undefined' values with null.
          // which is required when comparing objects as null != defined, making them techinically different.
          newData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phoneNumber: req.body.phoneNumber,
            cabCompany: req.body.cabCompany,
            issueDate: funcHelpers.fixEmptyValue(req.body.issueDate),
            expiryDate: funcHelpers.fixEmptyValue(req.body.expiryDate),
            policeVSC: funcHelpers.fixEmptyValue(req.body.policeVSC),
            citizenship: funcHelpers.fixEmptyValue(req.body.citizenship),
            photoID: funcHelpers.fixEmptyValue(req.body.photoID),
            driversAbstract: funcHelpers.fixEmptyValue(
              req.body.driversAbstract
            ),
            notes: req.body.notes,
          };

          // compare the two objects to check if they contain equal properties. If NOT (false), then proceed with update.
          if (!funcHelpers.areObjectsEqual(currentData, newData)) {
            TaxiDriver.update(
              {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                phoneNumber: req.body.phoneNumber,
                cabCompany: req.body.cabCompany,
                issueDate: funcHelpers.fixEmptyValue(req.body.issueDate),
                expiryDate: funcHelpers.fixEmptyValue(req.body.expiryDate),
                policeVSC: req.body.policeVSC,
                citizenship: req.body.citizenship,
                photoID: req.body.photoID,
                driversAbstract: req.body.driversAbstract,
                notes: req.body.notes,
              },
              {
                where: {
                  taxiDriverID: req.params.id,
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
          TaxiDriverAddress.findOne({
            where: {
              taxiDriverID: req.params.id,
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
              TaxiDriverAddress.update(
                {
                  streetNumber: req.body.streetNumber,
                  streetName: req.body.streetName,
                  town: req.body.town,
                  postalCode: req.body.postalCode,
                },
                {
                  where: {
                    taxiDriverID: req.params.id,
                  },
                }
              );
            }
          });
        })
        .then(() => {
          return res.redirect("/taxiLicenses/broker/" + req.session.brokerID);
        })
        .catch((err) => {
          return res.render("taxiLicenses/editDriver", {
            title: "BWG | Edit Taxi Driver",
            message: "Page Error!",
            auth: req.session.auth, // authorization.
          });
        });
    }
  }
);

module.exports = router;
