var express = require("express");
var router = express.Router();
// models.
var Dropdown = require("../../models/dropdownManager/dropdown");
var DonationBinOperator = require("../../models/donationBin/donationBinOperator");
const DonationBinOperatorAddress = require("../../models/donationBin/donationBinOperatorAddress");
// express-validate.
const { body, validationResult } = require("express-validator");

/* GET /donationBin/editDonationBinOperator/:id */
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

  DonationBinOperator.findOne({
    where: {
      donationBinOperatorID: req.params.id,
    },
    include: [
      {
        model: DonationBinOperatorAddress,
      },
    ],
  }).then((results) => {
    return res.render("donationBin/editDonationBinOperator", {
      title: "BWG | Edit Donation Bin Operator",
      errorMessages: messages,
      email: req.session.email,
      auth: req.session.auth, // authorization.
      streets: streets,
      formData: {
        firstName: results.firstName,
        lastName: results.lastName,
        phoneNumber: results.phoneNumber,
        email: results.email,
        licenseNumber: results.licenseNumber,
        photoID: results.photoID,
        charityInformation: results.charityInformation,
        ownerConsent: results.ownerConsent,
        certificateOfInsurance: results.certificateOfInsurance,
        sitePlan: results.sitePlan,
        streetNumber: results.donationBinOperatorAddresses[0].streetNumber,
        streetName: results.donationBinOperatorAddresses[0].streetName,
        town: results.donationBinOperatorAddresses[0].town,
        postalCode: results.donationBinOperatorAddresses[0].postalCode,
      },
    });
  });
});

/* POST /donationBin/editDonationBinOperator/:id */
router.post("/:id", async (req, res, next) => {
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
    return res.render("donationBin/editDonationBinOperator", {
      title: "BWG | Edit Donation Bin Operator",
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
    DonationBinOperator.update(
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
        where: {
          donationBinOperatorID: req.params.id,
        },
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
        return res.render("donationBin/editDonationBinOperator", {
          title: "BWG | Edit Donation Bin Operator",
          message: "Page Error!",
        });
      });
  }
});

module.exports = router;
