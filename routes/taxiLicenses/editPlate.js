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
  }).then((results) => {
    return res.render("taxiLicenses/editPlate", {
      title: "BWG | Edit Taxi Plate",
      errorMessages: messages,
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
  });
});

/* POST /taxiLicenses/editPlate/:id */
router.post(
  "/:id",
  body("firstName")
    .if(body("firstName").notEmpty())
    .matches(/^[^%<>^$\/\\;!{}?]+$/)
    .withMessage("Invalid First Name Entry!")
    .trim(),
  body("lastName")
    .if(body("lastName").notEmpty())
    .matches(/^[^%<>^$\/\\;!{}?]+$/)
    .withMessage("Invalid Last Name Entry!")
    .trim(),
  body("phoneNumber")
    .if(body("phoneNumber").notEmpty())
    .matches(/^[^%<>^$\/\\;!{}?]+$/)
    .withMessage("Invalid Phone Number Entry!")
    .trim(),
  body("email")
    .if(body("email").notEmpty())
    .isEmail()
    .withMessage("Invalid Email Entry!")
    .trim(),
  body("streetNumber")
    .if(body("streetNumber").notEmpty())
    .matches(/^[^%<>^$\/\\;!{}?]+$/)
    .withMessage("Invalid Street Number Entry!")
    .trim(),
  body("streetName")
    .if(body("streetName").notEmpty())
    .matches(/^[^%<>^$\/\\;!{}?]+$/)
    .withMessage("Invalid Street Name Entry!")
    .trim(),
  body("town")
    .if(body("town").notEmpty())
    .matches(/^[^%<>^$\/\\;!{}?]+$/)
    .withMessage("Invalid Town Entry!")
    .trim(),
  body("postalCode")
    .if(body("postalCode").notEmpty())
    .matches(/^[^%<>^$\/\\;!{}?]+$/)
    .withMessage("Invalid Postal Code Entry!")
    .trim(),
  body("notes")
    .if(body("notes").notEmpty())
    .matches(/^[\r\na-zA-Z0-9\/\-,.:"' ]+/)
    .withMessage("Invalid Notes Entry!")
    .trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // use built-in array() to convert Result object to array for custom error messages.
    var errorArray = errors.array();

    // if errors is NOT empty (if there are errors...).
    if (!errors.isEmpty()) {
      return res.render("taxiLicenses/editPlate", {
        title: "BWG | Edit Taxi Plate",
        errorMessages: errorArray[0].msg,
        email: req.session.email,
        auth: req.session.auth, // authorization.
        dropdownValues: dropdownValues,
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
      TaxiPlate.update(
        {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          phoneNumber: req.body.phoneNumber,
          email: req.body.email,
          townPlateNumber: req.body.townPlateNumber,
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
      )
        .then(() => {
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
        })
        .then(() => {
          return res.redirect("/taxiLicenses/broker/" + req.session.brokerID);
        })
        .catch((err) => {
          return res.render("taxiLicenses/editPlate", {
            title: "BWG | Edit Taxi Plate",
            message: "Page Error!",
          });
        });
    }
  }
);

module.exports = router;
