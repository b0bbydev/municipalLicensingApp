var express = require("express");
var router = express.Router();
// models.
var Dropdown = require("../../models/dropdownManager/dropdown");
var DonationBinOperator = require("../../models/donationBin/donationBinOperator");
const DonationBinOperatorAddress = require("../../models/donationBin/donationBinOperatorAddress");
// express-validate.
const { body, validationResult } = require("express-validator");

/* GET /donationBin/addOperator */
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

  return res.render("donationBin/addOperator", {
    title: "BWG | Add Donation Bin Operator",
    errorMessages: messages,
    email: req.session.email,
    auth: req.session.auth, // authorization.
    streets: streets,
  });
});

/* POST /donationBin/addDonationBinOperator */
router.post(
  "/",
  body("firstName")
    .if(body("firstName").notEmpty())
    .matches(/^[a-zA-Z\'-]*$/)
    .withMessage("Invalid First Name Entry!")
    .trim(),
  body("lastName")
    .if(body("lastName").notEmpty())
    .matches(/^[a-zA-Z\'-]*$/)
    .withMessage("Invalid Last Name Entry!")
    .trim(),
  body("phoneNumber")
    .if(body("phoneNumber").notEmpty())
    .matches(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/)
    .withMessage("Invalid Phone Number Entry!")
    .trim(),
  body("email")
    .if(body("email").notEmpty())
    .isEmail()
    .withMessage("Invalid Email Entry!")
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
    .matches(/^[a-zA-Z. ]*$/)
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
      return res.render("donationBin/addOperator", {
        title: "BWG | Add Donation Bin Operator",
        errorMessages: errorArray[0].msg,
        email: req.session.email,
        auth: req.session.auth, // authorization.
        streets: streets,
        // save form values if submission is unsuccessful.
        formData: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          phoneNumber: req.body.phoneNumber,
          email: req.body.email,
          licenseNumber: req.body.licenseNumber,
          photoID: req.body.photoID,
          charityInformation: req.body.charityInformation,
          ownerConsent: req.body.ownerConsent,
          certificateOfInsurance: req.body.certificateOfInsurance,
          sitePlan: req.body.sitePlan,
          streetNumber: req.body.streetNumber,
          streetName: req.body.streetName,
          town: req.body.town,
          postalCode: req.body.postalCode,
        },
      });
    } else {
      DonationBinOperator.create(
        {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          phoneNumber: req.body.phoneNumber,
          email: req.body.email,
          licenseNumber: req.body.licenseNumber,
          photoID: req.body.photoID,
          charityInformation: req.body.charityInformation,
          ownerConsent: req.body.ownerConsent,
          certificateOfInsurance: req.body.certificateOfInsurance,
          sitePlan: req.body.sitePlan,
          donationBinPropertyOwnerID: req.session.donationBinPropertyOwnerID,
          donationBinOperatorAddresses: [
            {
              streetNumber: req.body.streetNumber,
              streetName: req.body.streetName,
              town: req.body.town,
              postalCode: req.body.postalCode,
            },
          ],
        },
        {
          include: [DonationBinOperatorAddress],
        }
      )
        .then(() => {
          return res.redirect(
            "/donationBin/operators/" + req.session.donationBinPropertyOwnerID
          );
        })
        .catch((err) => {
          return res.render("donationBin/addOperator", {
            title: "BWG | Add Donation Bin Operator",
            message: "Page Error!",
          });
        });
    }
  }
);

module.exports = router;
