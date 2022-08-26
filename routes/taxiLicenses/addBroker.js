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

/* GET /taxiLicenses/addBroker */
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

  return res.render("taxiLicenses/addBroker", {
    title: "BWG | Add Taxi Broker",
    message: messages,
    email: req.session.email,
    auth: req.session.auth, // authorization.
    streets: streets,
  });
});

/* POST /taxiLicenses/addBroker */
router.post(
  "/",
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
    });

    // if errors is NOT empty (if there are errors...).
    if (!errors.isEmpty()) {
      return res.render("taxiLicenses/addBroker", {
        title: "BWG | Add Taxi Broker",
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
      TaxiBroker.create(
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
          taxiBrokerAddresses: [
            {
              streetNumber: req.body.streetNumber,
              streetName: req.body.streetName,
              town: req.body.town,
              postalCode: req.body.postalCode,
            },
          ],
        },
        {
          include: [TaxiBrokerAddress],
        }
      )
        .then(() => {
          return res.redirect("/taxiLicenses");
        })
        .catch((err) => {
          return res.render("taxiLicenses/addBroker", {
            title: "BWG | Add Taxi Broker",
            message: "Page Error!",
            auth: req.session.auth, // authorization.
          });
        });
    }
  }
);

module.exports = router;
