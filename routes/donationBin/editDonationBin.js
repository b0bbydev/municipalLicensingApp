var express = require("express");
var router = express.Router();
// models.
var DonationBin = require("../../models/donationBin/donationBin");
// express-validate.
const { body, validationResult } = require("express-validator");

/* GET /donationBin/editDonationBin/:id */
router.get("/:id", async (req, res, next) => {
  // check if there's an error message in the session
  let messages = req.session.messages || [];
  // clear session messages
  req.session.messages = [];

  DonationBin.findOne({
    where: {
      donationBinID: req.params.id,
    },
  }).then((results) => {
    return res.render("donationBin/editDonationBin", {
      title: "BWG | Edit Donation Bin",
      errorMessages: messages,
      email: req.session.email,
      auth: req.session.auth, // authorization.
      formData: {
        colour: results.colour,
        material: results.material,
        pickupSchedule: results.pickupSchedule,
        itemsCollected: results.itemsCollected,
        notes: results.notes,
      },
    });
  });
});

/* POST /donationBin/editDonationBin/:id */
router.post("/:id", async (req, res, next) => {
  // server side validation.
  const errors = validationResult(req);

  // use built-in array() to convert Result object to array for custom error messages.
  var errorArray = errors.array();

  // if errors is NOT empty (if there are errors...).
  if (!errors.isEmpty()) {
    return res.render("donationBin/editDonationBin", {
      title: "BWG | Edit Donation Bin",
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
    DonationBin.update(
      {
        colour: req.body.colour,
        material: req.body.material,
        pickupSchedule: req.body.pickupSchedule,
        itemsCollected: req.body.itemsCollected,
        notes: req.body.notes,
      },
      {
        where: {
          donationBinID: req.params.id,
        },
      }
    )
      .then(
        res.redirect("/donationBin/bins/" + req.session.donationBinOperatorID)
      )
      .catch((err) => {
        return res.render("donationBin/editDonationBin", {
          title: "BWG | Edit Donation Bin",
          message: "Page Error!",
        });
      });
  }
});

module.exports = router;
