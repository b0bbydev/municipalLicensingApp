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
    errorMessages: messages,
    email: req.session.email,
    auth: req.session.auth, // authorization.
    streets: streets,
  });
});

router.post(
  "/",
  body("ownerName")
    .if(body("ownerName").notEmpty())
    .matches(/^[ a-zA-Z\'"/,-]*$/)
    .withMessage("Invalid Owner Name Entry!")
    .trim(),
  body("companyName")
    .if(body("companyName").notEmpty())
    .matches(/^[ a-zA-Z0-9\'"/,-]*$/)
    .withMessage("Invalid Company Name Entry!")
    .trim(),
  body("phoneNumber")
    .if(body("phoneNumber").notEmpty())
    .matches(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/)
    .withMessage("Invalid Phone Number Entry!")
    .trim(),
  body("licenseNumber")
    .if(body("licenseNumber").notEmpty())
    .matches(/^[a-zA-Z0-9\/\-,.' ]*$/)
    .withMessage("Invalid License Number Entry!")
    .trim(),
  body("streetNumber")
    .if(body("streetNumber").notEmpty())
    .matches(/^[0-9. ]*$/)
    .withMessage("Invalid Street Number Entry!")
    .trim(),
  body("streetName")
    .if(body("streetName").notEmpty())
    .matches(/^[a-zA-Z0-9. ]*$/)
    .withMessage("Invalid Street Name Entry!")
    .trim(),
  body("town")
    .if(body("town").notEmpty())
    .matches(/^[a-zA-Z, ]*$/)
    .withMessage("Invalid Town Entry!")
    .trim(),
  body("postalCode")
    .if(body("postalCode").notEmpty())
    .matches(/^[a-zA-Z0-9- ]*$/)
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
      return res.render("taxiLicenses/addBroker", {
        title: "BWG | Add Taxi Broker",
        errorMessages: errorArray[0].msg,
        email: req.session.email,
        auth: req.session.auth, // authorization.
        dropdownValues: dropdownValues,
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
          });
        });
    }
  }
);

module.exports = router;
