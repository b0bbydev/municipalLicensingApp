var express = require("express");
var router = express.Router();
// models.
const Dropdown = require("../../models/dropdownManager/dropdown");
const DonationBinCharity = require("../../models/donationBin/donationBinCharity");
// express-validate.
const { body, validationResult } = require("express-validator");

/* GET /donationBin/addCharity */
router.get("/", async (req, res, next) => {
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

  return res.render("donationBin/addCharity", {
    title: "BWG | Add Donation Bin Charity",
    errorMessages: messages,
    email: req.session.email,
    auth: req.session.auth, // authorization.
    organizationTypes: organizationTypes,
  });
});

/* POST /donationBin/addDonationBinCharity */
router.post(
  "/",
  body("charityName")
    .if(body("charityName").notEmpty())
    .matches(/^[^%<>^$\/\\;!{}?]+$/)
    .withMessage("Invalid Charity Name Entry!")
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
  body("registrationNumber")
    .if(body("registrationNumber").notEmpty())
    .matches(/^[^%<>^$\/\\;!{}?]+$/)
    .withMessage("Invalid Registration Number Entry!")
    .trim(),
  body("organizationType")
    .if(body("organizationType").notEmpty())
    .matches(/^[^%<>^$\/\\;!{}?]+$/)
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
      return res.render("donationBin/addCharity", {
        title: "BWG | Add Donation Bin Charity",
        message: errorArray[0].msg,
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
      DonationBinCharity.create({
        charityName: req.body.charityName,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        registrationNumber: req.body.registrationNumber,
        organizationType: req.body.organizationType,
        donationBinID: req.session.donationBinID,
      })
        .then(() => {
          return res.redirect("/donationBin/bins/" + req.session.donationBinID);
        })
        .catch((err) => {
          return res.render("donationBin/addCharity", {
            title: "BWG | Add Donation Bin Charity",
            message: "Page Error!",
          });
        });
    }
  }
);

module.exports = router;
