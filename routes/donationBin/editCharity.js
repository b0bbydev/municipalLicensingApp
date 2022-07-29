var express = require("express");
var router = express.Router();
// models.
const Dropdown = require("../../models/dropdownManager/dropdown");
const DonationBinCharity = require("../../models/donationBin/donationBinCharity");
// express-validate.
const { body, param, validationResult } = require("express-validator");

/* GET /donationBin/editCharity/:id */
router.get(
  "/:id",
  param("id").matches(/^\d+$/).trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...),
    if (!errors.isEmpty()) {
      return res.render("donationBin/editCharity", {
        title: "BWG | Edit Donation Bin Charity",
        message: "Page Error!",
        email: req.session.email,
        auth: req.session.auth, // authorization.
      });
    } else {
      // check if there's an error message in the session
      let messages = req.session.messages || [];
      // clear session messages
      req.session.messages = [];

      // get organization types.
      var organizationTypes = await Dropdown.findAll({
        where: {
          dropdownFormID: 21, // organization types.
        },
      });

      DonationBinCharity.findOne({
        where: {
          donationBinCharityID: req.params.id,
        },
      }).then((results) => {
        return res.render("donationBin/editCharity", {
          title: "BWG | Edit Donation Bin Charity",
          errorMessages: messages,
          email: req.session.email,
          auth: req.session.auth, // authorization.
          organizationTypes: organizationTypes,
          // populate input fields with existing values.
          formData: {
            charityName: results.charityName,
            phoneNumber: results.phoneNumber,
            email: results.email,
            registrationNumber: results.registrationNumber,
            organizationType: results.organizationType,
          },
        });
      });
    }
  }
);

/* POST /donationBin/editCharity/:id */
router.post(
  "/:id",
  param("id").matches(/^\d+$/).trim(),
  body("charityName")
    .if(body("charityName").notEmpty())
    .matches(/^[a-zA-Z0-9\/\-,.' ]*$/)
    .withMessage("Invalid Charity Name Entry!")
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
  body("registrationNumber")
    .if(body("registrationNumber").notEmpty())
    .matches(/^[a-zA-Z0-9\/\-,.' ]*$/)
    .withMessage("Invalid Registration Number Entry!")
    .trim(),
  body("organizationType")
    .if(body("organizationType").notEmpty())
    .matches(/^[a-zA-Z0-9\/\-,.' ]*$/)
    .withMessage("Invalid Organization Type Entry!")
    .trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // use built-in array() to convert Result object to array for custom error messages.
    var errorArray = errors.array();

    // get organization types.
    var organizationTypes = await Dropdown.findAll({
      where: {
        dropdownFormID: 21, // organization types.
      },
    });

    // if errors is NOT empty (if there are errors...).
    if (!errors.isEmpty()) {
      return res.render("donationBin/editCharity", {
        title: "BWG | Edit Donation Bin Charity",
        errorMessages: errorArray[0].msg,
        email: req.session.email,
        auth: req.session.auth, // authorization.
        organizationTypes: organizationTypes,
        // save form values if submission is unsuccessful.
        formData: {
          charityName: req.body.charityName,
          phoneNumber: req.body.phoneNumber,
          email: req.body.email,
          registrationNumber: req.body.registrationNumber,
          organizationType: req.body.organizationType,
        },
      });
    } else {
      DonationBinCharity.update(
        {
          charityName: req.body.charityName,
          phoneNumber: req.body.phoneNumber,
          email: req.body.email,
          registrationNumber: req.body.registrationNumber,
          organizationType: req.body.organizationType,
        },
        {
          where: {
            donationBinCharityID: req.params.id,
          },
        }
      )
        .then(() => {
          return res.redirect("/donationBin/bin/" + req.session.donationBinID);
        })
        .catch((err) => {
          return res.render("donationBin/editCharity", {
            title: "BWG | Edit Donation Bin Charity",
            message: "Page Error!",
          });
        });
    }
  }
);

module.exports = router;
