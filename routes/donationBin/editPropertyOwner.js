var express = require("express");
var router = express.Router();
// models.
var Dropdown = require("../../models/dropdownManager/dropdown");
var DonationBinPropertyOwner = require("../../models/donationBin/donationBinPropertyOwner");
var DonationBinPropertyOwnerAddress = require("../../models/donationBin/donationBinPropertyOwnerAddress");
// express-validate.
const { body, param, validationResult } = require("express-validator");

/* GET /donationBin/editPropertyOwner/:id */
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
    return res.render("donationBin/editPropertyOwner", {
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

/* POST /donationBin/editDonationBinPropertyOwner/:id */
router.post(
  "/:id",
  param("id").matches(/^\d+$/).trim(),
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
  async (req, res, next) => {
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
      return res.render("donationBin/editPropertyOwner", {
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
        },
        {
          where: {
            donationBinPropertyOwnerID: req.params.id,
          },
        }
      )
        .then(() => {
          DonationBinPropertyOwnerAddress.update(
            {
              streetNumber: req.body.streetNumber,
              streetName: req.body.streetName,
              town: req.body.town,
              postalCode: req.body.postalCode,
            },
            {
              where: {
                donationBinPropertyOwnerID: req.params.id,
              },
            }
          );
        })
        .then(() => {
          return res.redirect(
            "/donationBin/propertyOwner/" + req.session.donationBinCharityID
          );
        })
        .catch((err) => {
          return res.render("donationBin/editPropertyOwner", {
            title: "BWG | Edit Property Owner",
            message: "Page Error!",
          });
        });
    }
  }
);

module.exports = router;
