var express = require("express");
var router = express.Router();
// models.
var Dropdown = require("../../models/dropdownManager/dropdown");
var DonationBinPropertyOwner = require("../../models/donationBin/donationBinPropertyOwner");
var DonationBinPropertyOwnerAddress = require("../../models/donationBin/donationBinPropertyOwnerAddress");
// express-validate.
const { body, validationResult } = require("express-validator");

/* GET /donationBin/editDonationBinPropertyOwner/:id */
router.get("/:id", async (req, res, next) => {
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

  DonationBinPropertyOwner.findOne({
    where: {
      donationBinPropertyOwnerID: req.params.id,
    },
    include: [
      {
        model: DonationBinPropertyOwnerAddress,
      },
    ],
  }).then((results) => {
    return res.render("donationBin/editDonationBinPropertyOwner", {
      title: "BWG | Edit Property Owner",
      errorMessages: messages,
      email: req.session.email,
      auth: req.session.auth, // authorization.
      dropdownValues: dropdownValues,
      formData: {
        firstName: results.firstName,
        lastName: results.lastName,
        phoneNumber: results.phoneNumber,
        email: results.email,
        streetNumber: results.donationBinPropertyOwnerAddresses[0].streetNumber,
        streetName: results.donationBinPropertyOwnerAddresses[0].streetName,
        town: results.donationBinPropertyOwnerAddresses[0].town,
        postalCode: results.donationBinPropertyOwnerAddresses[0].postalCode,
      },
    });
  });
});

/* POST /donationBin/editPropertyOwner/:id */
router.post("/:id", async (req, res, next) => {
  // server side validation.
  const errors = validationResult(req);

  // use built-in array() to convert Result object to array for custom error messages.
  var errorArray = errors.array();

  // get dropdown values.
  var dropdownValues = await Dropdown.findAll({
    where: {
      dropdownFormID: 13, // streets
    },
  });

  // if errors is NOT empty (if there are errors...).
  if (!errors.isEmpty()) {
    return res.render("donationBin/editDonationBinPropertyOwner", {
      title: "BWG | Edit Property Owner",
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
    DonationBinPropertyOwner.update(
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
        where: {
          donationBinPropertyOwnerID: req.params.id,
        },
      },
      {
        include: [DonationBinPropertyOwnerAddress],
      }
    )
      .then(() => {
        return res.redirect("/donationBin/propertyOwner/" + req.params.id);
      })
      .catch((err) => {
        return res.render("donationBin/editDonationBinPropertyOwner", {
          title: "BWG | Edit Property Owner",
          message: "Page Error!" + err,
        });
      });
  }
});

module.exports = router;
