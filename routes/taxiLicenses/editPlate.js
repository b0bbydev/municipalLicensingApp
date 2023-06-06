var express = require("express");
var router = express.Router();
// models.
const Dropdown = require("../../models/dropdownManager/dropdown");
const TaxiPlate = require("../../models/taxiLicenses/taxiPlate");
const TaxiPlateOwnerAddress = require("../../models/taxiLicenses/taxiPlateOwnerAddress");
// helper.
const funcHelpers = require("../../config/funcHelpers");
// express-validate.
const { body, validationResult } = require("express-validator");

/* GET /taxiLicenses/editPlate/:id */
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

  TaxiPlate.findOne({
    where: {
      taxiPlateID: req.params.id,
    },
    include: [
      {
        model: TaxiPlateOwnerAddress,
      },
    ],
  })
    .then((results) => {
      return res.render("taxiLicenses/editPlate", {
        title: "BWG | Edit Taxi Plate",
        message: messages,
        email: req.session.email,
        auth: req.session.auth, // authorization.
        streets: streets,
        // populate input fields with existing values.
        formData: {
          firstName: results.firstName,
          lastName: results.lastName,
          phoneNumber: results.phoneNumber,
          email: results.email,
          townPlateNumber: results.townPlateNumber,
          vehicleYearMakeModel: results.vehicleYearMakeModel,
          provincialPlate: results.provincialPlate,
          vin: results.vin,
          issueDate: results.issueDate,
          expiryDate: results.expiryDate,
          policeVSC: results.policeVSC,
          driversAbstract: results.driversAbstract,
          photoID: results.photoID,
          safetyCertificate: results.safetyCertificate,
          byLawInspection: results.byLawInspection,
          insurance: results.insurance,
          vehicleOwnership: results.vehicleOwnership,
          notes: results.notes,
          streetNumber: results.taxiPlateOwnerAddresses[0].streetNumber,
          streetName: results.taxiPlateOwnerAddresses[0].streetName,
          town: results.taxiPlateOwnerAddresses[0].town,
          postalCode: results.taxiPlateOwnerAddresses[0].postalCode,
        },
      });
    })
    .catch((err) => {
      return res.render("taxiLicenses/editPlate", {
        title: "BWG | Edit Taxi Plate",
        message: "Page Error!",
        auth: req.session.auth, // authorization.
      });
    });
});

/* POST /taxiLicenses/editPlate/:id */
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
  body("email")
    .if(body("email").notEmpty())
    .isEmail()
    .withMessage("Invalid Email Entry!")
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
      return res.render("taxiLicenses/editPlate", {
        title: "BWG | Edit Taxi Plate",
        message: errorArray[0].msg,
        email: req.session.email,
        auth: req.session.auth, // authorization.
        streets: streets,
        // save form values if submission is unsuccessful.
        formData: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          phoneNumber: req.body.phoneNumber,
          email: req.body.email,
          townPlateNumber: req.body.townPlateNumber,
          vehicleYearMakeModel: req.body.vehicleYearMakeModel,
          provincialPlate: req.body.provincialPlate,
          vin: req.body.vin,
          issueDate: req.body.issueDate,
          expiryDate: req.body.expiryDate,
          policeVSC: req.body.policeVSC,
          driversAbstract: req.body.driversAbstract,
          photoID: req.body.photoID,
          safetyCertificate: req.body.safetyCertificate,
          byLawInspection: req.body.byLawInspection,
          insurance: req.body.insurance,
          vehicleOwnership: req.body.vehicleOwnership,
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
      TaxiPlate.findOne({
        where: {
          taxiPlateID: req.params.id,
        },
      })
        .then((results) => {
          // put the CURRENT data into an object.
          currentData = {
            firstName: results.dataValues.firstName,
            lastName: results.dataValues.lastName,
            phoneNumber: results.dataValues.phoneNumber,
            email: results.dataValues.email,
            townPlateNumber: results.dataValues.townPlateNumber,
            vehicleYearMakeModel: results.dataValues.vehicleYearMakeModel,
            provincialPlate: results.dataValues.provincialPlate,
            vin: results.dataValues.vin,
            issueDate: results.dataValues.issueDate,
            expiryDate: results.dataValues.expiryDate,
            policeVSC: results.dataValues.policeVSC,
            driversAbstract: results.dataValues.driversAbstract,
            photoID: results.dataValues.photoID,
            safetyCertificate: results.dataValues.safetyCertificate,
            byLawInspection: results.dataValues.byLawInspection,
            insurance: results.dataValues.insurance,
            vehicleOwnership: results.dataValues.vehicleOwnership,
            notes: results.dataValues.notes,
          };

          // put the NEW data into an object.
          // fixEmptyValue() in this case will replace any 'undefined' values with null.
          // which is required when comparing objects as null != defined, making them techinically different.
          newData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email,
            townPlateNumber: parseInt(req.body.townPlateNumber),
            vehicleYearMakeModel: req.body.vehicleYearMakeModel,
            provincialPlate: req.body.provincialPlate,
            vin: req.body.vin,
            issueDate: funcHelpers.fixEmptyValue(req.body.issueDate),
            expiryDate: funcHelpers.fixEmptyValue(req.body.expiryDate),
            policeVSC: funcHelpers.fixEmptyValue(req.body.policeVSC),
            driversAbstract: funcHelpers.fixEmptyValue(
              req.body.driversAbstract
            ),
            photoID: funcHelpers.fixEmptyValue(req.body.photoID),
            safetyCertificate: funcHelpers.fixEmptyValue(
              req.body.safetyCertificate
            ),
            byLawInspection: funcHelpers.fixEmptyValue(
              req.body.byLawInspection
            ),
            insurance: funcHelpers.fixEmptyValue(req.body.insurance),
            vehicleOwnership: funcHelpers.fixEmptyValue(
              req.body.vehicleOwnership
            ),
            notes: req.body.notes,
          };

          // compare the two objects to check if they contain equal properties. If NOT (false), then proceed with update.
          if (!funcHelpers.areObjectsEqual(currentData, newData)) {
            TaxiPlate.update(
              {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                phoneNumber: req.body.phoneNumber,
                email: req.body.email,
                townPlateNumber: funcHelpers.fixEmptyValue(
                  req.body.townPlateNumber
                ),
                vehicleYearMakeModel: req.body.vehicleYearMakeModel,
                provincialPlate: req.body.provincialPlate,
                vin: req.body.vin,
                issueDate: funcHelpers.fixEmptyValue(req.body.issueDate),
                expiryDate: funcHelpers.fixEmptyValue(req.body.expiryDate),
                policeVSC: req.body.policeVSC,
                driversAbstract: req.body.driversAbstract,
                photoID: req.body.photoID,
                safetyCertificate: req.body.safetyCertificate,
                byLawInspection: req.body.byLawInspection,
                insurance: req.body.insurance,
                vehicleOwnership: req.body.vehicleOwnership,
                notes: req.body.notes,
              },
              {
                where: {
                  taxiPlateID: req.params.id,
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
          TaxiPlateOwnerAddress.findOne({
            where: {
              taxiPlateID: req.params.id,
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
              TaxiPlateOwnerAddress.update(
                {
                  streetNumber: req.body.streetNumber,
                  streetName: req.body.streetName,
                  town: req.body.town,
                  postalCode: req.body.postalCode,
                },
                {
                  where: {
                    taxiPlateID: req.params.id,
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
          return res.render("taxiLicenses/editPlate", {
            title: "BWG | Edit Taxi Plate",
            message: "Page Error!",
            auth: req.session.auth, // authorization.
          });
        });
    }
  }
);

module.exports = router;
