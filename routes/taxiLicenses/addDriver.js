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

/* GET /taxiLicenses/addDriver */
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
    order: [["dropdownValue", "ASC"]],
  });
  // get cab companies.
  var cabCompanies = await Dropdown.findAll({
    where: {
      dropdownFormID: 30, // cab companies
    },
  });

  return res.render("taxiLicenses/addDriver", {
    title: "BWG | Add Taxi Driver",
    message: messages,
    email: req.session.email,
    auth: req.session.auth, // authorization.
    streets: streets,
    cabCompanies: cabCompanies,
  });
});

/* POST /taxiLicenses/addDriver */
router.post(
  "/",
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
      return res.render("taxiLicenses/addDriver", {
        title: "BWG | Add Taxi Driver",
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
      TaxiDriver.create(
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
          taxiBrokerID: req.session.brokerID,
          taxiDriverAddresses: [
            {
              streetNumber: req.body.streetNumber,
              streetName: req.body.streetName,
              town: req.body.town,
              postalCode: req.body.postalCode,
            },
          ],
        },
        {
          include: [TaxiDriverAddress],
        }
      )
        .then(() => {
          return res.redirect("/taxiLicenses/broker/" + req.session.brokerID);
        })
        .catch((err) => {
          return res.render("taxiLicenses/addDriver", {
            title: "BWG | Add Taxi Driver",
            message: "Page Error!",
            auth: req.session.auth, // authorization.
          });
        });
    }
  }
);

module.exports = router;
