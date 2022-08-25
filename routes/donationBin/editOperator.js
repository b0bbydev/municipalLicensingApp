var express = require("express");
var router = express.Router();
// models.
const Dropdown = require("../../models/dropdownManager/dropdown");
const DonationBinOperator = require("../../models/donationBin/donationBinOperator");
const DonationBinOperatorAddress = require("../../models/donationBin/donationBinOperatorAddress");
// helper.
const funcHelpers = require("../../config/funcHelpers");
// express-validate.
const { body, param, validationResult } = require("express-validator");

/* GET /donationBin/editOperator/:id */
router.get(
  "/:id",
  param("id").matches(/^\d+$/).trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...),
    if (!errors.isEmpty()) {
      return res.render("donationBin/editOperator", {
        title: "BWG | Edit Donation Bin Operator",
        message: "Page Error!",
        email: req.session.email,
        auth: req.session.auth, // authorization.
      });
    } else {
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
      })
        .then((results) => {
          return res.render("donationBin/editOperator", {
            title: "BWG | Edit Donation Bin Operator",
            message: messages,
            email: req.session.email,
            auth: req.session.auth, // authorization.
            streets: streets,
            // populate input fields with existing values.
            formData: {
              firstName: results.firstName,
              lastName: results.lastName,
              phoneNumber: results.phoneNumber,
              email: results.email,
              photoID: results.photoID,
              charityInformation: results.charityInformation,
              ownerConsent: results.ownerConsent,
              certificateOfInsurance: results.certificateOfInsurance,
              sitePlan: results.sitePlan,
              streetNumber:
                results.donationBinOperatorAddresses[0].streetNumber,
              streetName: results.donationBinOperatorAddresses[0].streetName,
              town: results.donationBinOperatorAddresses[0].town,
              postalCode: results.donationBinOperatorAddresses[0].postalCode,
            },
          });
        })
        .catch((err) => {
          return res.render("donationBin/editOperator", {
            title: "BWG | Edit Donation Bin Operator",
            message: "Page Error!",
          });
        });
    }
  }
);

/* POST /donationBin/editDonationBinOperator/:id */
router.post(
  "/:id",
  param("id").matches(/^\d+$/).trim(),
  body("firstName")
    .if(body("firstName").notEmpty())
    .matches(/^[^%<>^$\/\\;!{}?]+$/)
    .withMessage("Invalid First Name Entry!")
    .trim(),
  body("lastName")
    .if(body("lastName").notEmpty())
    .matches(/^[^%<>^$\/\\;!{}?]+$/)
    .withMessage("Invalid Last Name Entry!")
    .trim(),
  body("phoneNumber")
    .if(body("phoneNumber").notEmpty())
    .matches(/^[^%<>^$\/\\;!{}?]+$/)
    .withMessage("Invalid Phone Number Entry!")
    .trim(),
  body("email")
    .if(body("email").notEmpty())
    .isEmail()
    .withMessage("Invalid Email Entry!")
    .trim(),
  body("streetNumber")
    .if(body("streetNumber").notEmpty())
    .matches(/^[^%<>^$\/\\;!{}?]+$/)
    .withMessage("Invalid Street Number Entry!")
    .trim(),
  body("streetName")
    .if(body("streetName").notEmpty())
    .matches(/^[^%<>^$\/\\;!{}?]+$/)
    .withMessage("Invalid Street Name Entry!")
    .trim(),
  body("town")
    .if(body("town").notEmpty())
    .matches(/^[^%<>^$\/\\;!{}?]+$/)
    .withMessage("Invalid Town Entry!")
    .trim(),
  body("postalCode")
    .if(body("postalCode").notEmpty())
    .matches(/^[^%<>^$\/\\;!{}?]+$/)
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
      return res.render("donationBin/editOperator", {
        title: "BWG | Edit Donation Bin Operator",
        message: errorArray[0].msg,
        email: req.session.email,
        auth: req.session.auth, // authorization.
        streets: streets,
        // save form values if submission is unsuccessful.
        formData: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          phoneNumber: req.body.phoneNumber,
          email: req.body.email,
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
          photoID: req.body.photoID,
          charityInformation: req.body.charityInformation,
          ownerConsent: req.body.ownerConsent,
          certificateOfInsurance: req.body.certificateOfInsurance,
          sitePlan: req.body.sitePlan,
        },
        {
          where: {
            donationBinOperatorID: req.params.id,
          },
        }
      )
        .then(() => {
          /* begin check for ONLY updating data when a value has changed. */
          // create empty objects to hold data.
          let currentData = {};
          let newData = {};

          // get current data.
          DonationBinOperatorAddress.findOne({
            where: {
              donationBinOperatorID: req.params.id,
            },
          }).then((results) => {
            currentData = {
              streetNumber: results.streetNumber,
              streetName: results.streetName,
              town: results.town,
              postalCode: results.postalCode,
            };

            newData = {
              streetNumber: parseInt(req.body.streetNumber),
              streetName: req.body.streetName,
              town: req.body.town,
              postalCode: req.body.postalCode,
            };

            // compare the two objects to check if they contain equal properties. If NOT, then proceed with update.
            if (!funcHelpers.areObjectsEqual(currentData, newData)) {
              DonationBinOperatorAddress.update(
                {
                  streetNumber: req.body.streetNumber,
                  streetName: req.body.streetName,
                  town: req.body.town,
                  postalCode: req.body.postalCode,
                },
                {
                  where: {
                    donationBinOperatorID: req.params.id,
                  },
                }
              );
            }
          });
        })
        .then(() => {
          return res.redirect("/donationBin/bins/" + req.session.donationBinID);
        })
        .catch((err) => {
          return res.render("donationBin/editOperator", {
            title: "BWG | Edit Donation Bin Operator",
            message: "Page Error!",
          });
        });
    }
  }
);

module.exports = router;
