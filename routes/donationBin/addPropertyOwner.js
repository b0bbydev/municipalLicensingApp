var express = require("express");
var router = express.Router();
// models.
var Dropdown = require("../../models/dropdownManager/dropdown");
var DonationBinPropertyOwner = require("../../models/donationBin/donationBinPropertyOwner");
var DonationBinPropertyOwnerAddress = require("../../models/donationBin/donationBinPropertyOwnerAddress");
// express-validate.
const { body, validationResult } = require("express-validator");

/* GET /donationBin/addPropertyOwner */
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

  return res.render("donationBin/addPropertyOwner", {
    title: "BWG | Add Property Owner",
    errorMessages: messages,
    email: req.session.email,
    auth: req.session.auth, // authorization.
    dropdownValues: dropdownValues,
  });
});

/* POST /donationBin/addPropertyOwner */
router.post("/", async (req, res, next) => {
  // server side validation.
  const errors = validationResult(req);

  // use built-in array() to convert Result object to array for custom error messages.
  var errorArray = errors.array();

  // if errors is NOT empty (if there are errors...).
  if (!errors.isEmpty()) {
    return res.render("donationBin/addPropertyOwner", {
      title: "BWG | Add Property Owner",
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
        streetNumber: req.body.streetNumber,
        streetName: req.body.streetName,
        town: req.body.town,
        postalCode: req.body.postalCode,
      },
    });
  } else {
    DonationBinPropertyOwner.create(
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        donationBinCharityID: req.session.donationBinCharityID,
        donationBinPropertyOwnerAddresses: [
          {
            streetNumber: req.body.streetNumber,
            streetName: req.body.streetName,
            town: req.body.town,
            postalCode: req.body.postalCode,
          },
        ],
      },
      {
        include: [DonationBinPropertyOwnerAddress],
      }
    )
      .then(
        res.redirect(
          "/donationBin/propertyOwner/" + req.session.donationBinCharityID
        )
      )
      .catch((err) => {
        return res.render("donationBin/addPropertyOwner", {
          title: "BWG | Add Property Owner",
          message: "Page Error!",
        });
      });
  }
});

module.exports = router;
