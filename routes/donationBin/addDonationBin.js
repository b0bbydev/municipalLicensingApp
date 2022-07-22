var express = require("express");
var router = express.Router();
// models.
var DonationBin = require("../../models/donationBin/donationBin");
// express-validate.
const { body, validationResult } = require("express-validator");

/* GET /donationBin/addDonationBin */
router.get("/", async (req, res, next) => {
  // check if there's an error message in the session
  let messages = req.session.messages || [];
  // clear session messages
  req.session.messages = [];

  return res.render("donationBin/addDonationBin", {
    title: "BWG | Add Donation Bin",
    errorMessages: messages,
    email: req.session.email,
    auth: req.session.auth, // authorization.
  });
});

/* POST /donationBin/addDonationBin */
router.post(
  "/",
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
          colour: req.body.colour,
          material: req.body.material,
          pickupSchedule: req.body.pickupSchedule,
          itemsCollected: req.body.itemsCollected,
          notes: req.body.notes,
        },
      });
    } else {
      DonationBin.create({
        colour: req.body.colour,
        material: req.body.material,
        pickupSchedule: req.body.pickupSchedule,
        itemsCollected: req.body.itemsCollected,
        notes: req.body.notes,
        donationBinOperatorID: req.session.donationBinOperatorID,
      })
        .then(
          res.redirect("/donationBin/bins/" + req.session.donationBinOperatorID)
        )
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
