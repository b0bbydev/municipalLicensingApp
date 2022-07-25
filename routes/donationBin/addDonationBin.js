var express = require("express");
var router = express.Router();
// models.
var DonationBin = require("../../models/donationBin/donationBin");
var DonationBinAddress = require("../../models/donationBin/donationBinAddress");
var Dropdown = require("../../models/dropdownManager/dropdown");
// helpers.
const funcHelpers = require("../../config/funcHelpers");
// express-validate.
const { body, validationResult } = require("express-validator");

/* GET /donationBin/addDonationBin */
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

  return res.render("donationBin/addDonationBin", {
    title: "BWG | Add Donation Bin",
    errorMessages: messages,
    email: req.session.email,
    auth: req.session.auth, // authorization.
    streets: streets,
  });
});

/* POST /donationBin/addDonationBin */
router.post(
  "/",
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
  body("colour")
    .if(body("colour").notEmpty())
    .matches(/^[a-zA-Z\/\-,. ]*$/)
    .withMessage("Invalid Colour Entry!")
    .trim(),
  body("material")
    .if(body("material").notEmpty())
    .matches(/^[a-zA-Z0-9\/\-,.' ]*$/)
    .withMessage("Invalid Material Entry!")
    .trim(),
  body("pickupSchedule")
    .if(body("pickupSchedule").notEmpty())
    .matches(/^[\r\na-zA-Z0-9\/\-,.:"' ]+/)
    .withMessage("Invalid Pickup Schedule Entry!")
    .trim(),
  body("itemsCollected")
    .if(body("itemsCollected").notEmpty())
    .matches(/^[\r\na-zA-Z0-9\/\-,.:"' ]+/)
    .withMessage("Invalid Items Collected Entry!")
    .trim(),
  body("notes")
    .if(body("notes").notEmpty())
    .matches(/^[\r\na-zA-Z0-9\/\-,.:"' ]+/)
    .withMessage("Invalid Notes Entry!")
    .trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // use built-in array() to convert Result object to array for custom error messages.
    var errorArray = errors.array();

    // if errors is NOT empty (if there are errors...).
    if (!errors.isEmpty()) {
      return res.render("donationBin/addDonationBin", {
        title: "BWG | Add Donation Bin",
        errorMessages: errorArray[0].msg,
        email: req.session.email,
        auth: req.session.auth, // authorization.
        dropdownValues: dropdownValues,
        // save form values if submission is unsuccessful.
        formData: {
          issueDate: req.body.issueDate,
          expiryDate: req.body.expiryDate,
          streetNumber: req.body.streetNumber,
          streetName: req.body.streetName,
          town: req.body.town,
          postalCode: req.body.postalCode,
          colour: req.body.colour,
          material: req.body.material,
          pickupSchedule: req.body.pickupSchedule,
          itemsCollected: req.body.itemsCollected,
          notes: req.body.notes,
        },
      });
    } else {
      DonationBin.create(
        {
          issueDate: funcHelpers.fixEmptyValue(req.body.issueDate),
          expiryDate: funcHelpers.fixEmptyValue(req.body.expiryDate),
          colour: req.body.colour,
          material: req.body.material,
          pickupSchedule: req.body.pickupSchedule,
          itemsCollected: req.body.itemsCollected,
          notes: req.body.notes,
          donationBinAddresses: [
            {
              streetNumber: req.body.streetNumber,
              streetName: req.body.streetName,
              town: req.body.town,
              postalCode: req.body.postalCode,
            },
          ],
        },
        {
          include: [DonationBinAddress],
        }
      )
        .then(() => {
          return res.redirect("/donationBin");
        })
        .catch((err) => {
          return res.render("donationBin/addDonationBin", {
            title: "BWG | Add Donation Bin",
            message: "Page Error!",
          });
        });
    }
  }
);

module.exports = router;
