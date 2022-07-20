var express = require("express");
var router = express.Router();
// models.
var Dropdown = require("../../models/dropdownManager/dropdown");
var DonationBinOperator = require("../../models/donationBin/donationBinOperator");
// express-validate.
const { body, validationResult } = require("express-validator");
const DonationBinOperatorAddress = require("../../models/donationBin/donationBinOperatorAddress");

/* GET /donationBin/addDonationBinOperator */
router.get("/", async (req, res, next) => {
  // check if there's an error message in the session
  let messages = req.session.messages || [];
  // clear session messages
  req.session.messages = [];

  // get dropdown values.
  var dropdownValues = await Dropdown.findAll({
    where: {
      dropdownFormID: 13, // streets
    },
  });

  return res.render("donationBin/addDonationBinOperator", {
    title: "BWG | Add Donation Bin Operator",
    errorMessages: messages,
    email: req.session.email,
    auth: req.session.auth, // authorization.
    dropdownValues: dropdownValues,
  });
});

/* POST /donationBin/addDonationBinOperator */
router.post("/", async (req, res, next) => {
  // server side validation.
  const errors = validationResult(req);

  // use built-in array() to convert Result object to array for custom error messages.
  var errorArray = errors.array();

  // if errors is NOT empty (if there are errors...).
  if (!errors.isEmpty()) {
    return res.render("donationBin/addDonationBinOperator", {
      title: "BWG | Add Donation Bin Operator",
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
      .then(res.redirect("/donationBin"))
      .catch((err) => {
        return res.render("donationBin/addDonationBinOperator", {
          title: "BWG | Add Donation Bin Operator",
          message: "Page Error!",
        });
      });
  }
});

module.exports = router;
