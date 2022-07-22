var express = require("express");
var router = express.Router();
// models.
var Dropdown = require("../../models/dropdownManager/dropdown");
var DonationBinCharity = require("../../models/donationBin/donationBinCharity");
// helpers.
const funcHelpers = require("../../config/funcHelpers");
// express-validate.
const { body, validationResult } = require("express-validator");

/* GET /donationBin/addDonationBinCharity */
router.get("/", async (req, res, next) => {
  // check if there's an error message in the session
  let messages = req.session.messages || [];
  // clear session messages
  req.session.messages = [];

  // get dropdown values.
  var dropdownValues = await Dropdown.findAll({
    where: {
      dropdownFormID: 21, // organization types.
    },
  });

  return res.render("donationBin/addDonationBinCharity", {
    title: "BWG | Add Donation Bin Charity",
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
        charityName: req.body.charityName,
        charityPhoneNumber: req.body.charityPhoneNumber,
        charityEmail: req.body.charityEmail,
        issueDate: req.body.issueDate,
        expiryDate: req.body.expiryDate,
        registrationNumber: req.body.registrationNumber,
        organizationType: req.body.organizationType,
      },
    });
  } else {
    DonationBinCharity.create({
      charityName: req.body.charityName,
      charityPhoneNumber: req.body.charityPhoneNumber,
      charityEmail: req.body.charityEmail,
      issueDate: funcHelpers.fixEmptyValue(req.body.issueDate),
      expiryDate: funcHelpers.fixEmptyValue(req.body.expiryDate),
      registrationNumber: req.body.registrationNumber,
      organizationType: req.body.organizationType,
    })
      .then(() => {
        return res.redirect("/donationBin");
      })
      .catch((err) => {
        return res.render("donationBin/addDonationBinOperator", {
          title: "BWG | Add Donation Bin Operator",
          message: "Page Error!",
        });
      });
  }
});

module.exports = router;
