var express = require("express");
var router = express.Router();
// models.
const Dropdown = require("../../models/dropdownManager/dropdown");
const DonationBin = require("../../models/donationBin/donationBin");
const DonationBinAddress = require("../../models/donationBin/donationBinAddress");
// express-validate.
const { body, param, validationResult } = require("express-validator");

/* GET /donationBin/editDonationBin/:id */
router.get(
  "/:id",
  param("id").matches(/^\d+$/).trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...),
    if (!errors.isEmpty()) {
      return res.render("donationBin/editDonationBin", {
        title: "BWG | Edit Donation Bin",
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

      DonationBin.findOne({
        where: {
          donationBinID: req.params.id,
        },
        include: [
          {
            model: DonationBinAddress,
          },
        ],
      }).then((results) => {
        return res.render("donationBin/editDonationBin", {
          title: "BWG | Edit Donation Bin",
          errorMessages: messages,
          email: req.session.email,
          auth: req.session.auth, // authorization.
          streets: streets,
          formData: {
            colour: results.colour,
            material: results.material,
            pickupSchedule: results.pickupSchedule,
            itemsCollected: results.itemsCollected,
            notes: results.notes,
            streetNumber: results.donationBinAddresses[0].streetNumber,
            streetName: results.donationBinAddresses[0].streetName,
            town: results.donationBinAddresses[0].town,
            postalCode: results.donationBinAddresses[0].postalCode,
          },
        });
      });
    }
  }
);

/* POST /donationBin/editDonationBin/:id */
router.post(
  "/:id",
  param("id").matches(/^\d+$/).trim(),
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
  body("colour")
    .if(body("colour").notEmpty())
    .matches(/^[^%<>^$\/\\;!{}?]+$/)
    .withMessage("Invalid Colour Entry!")
    .trim(),
  body("material")
    .if(body("material").notEmpty())
    .matches(/^[^%<>^$\/\\;!{}?]+$/)
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

    // get streets.
    var streets = await Dropdown.findAll({
      where: {
        dropdownFormID: 13, // streets
      },
    });

    // if errors is NOT empty (if there are errors...).
    if (!errors.isEmpty()) {
      return res.render("donationBin/editDonationBin", {
        title: "BWG | Edit Donation Bin",
        message: errorArray[0].msg,
        email: req.session.email,
        auth: req.session.auth, // authorization.
        streets: streets,
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
        .then(() => {
          DonationBinAddress.update(
            {
              streetNumber: req.body.streetNumber,
              streetName: req.body.streetName,
              town: req.body.town,
              postalCode: req.body.postalCode,
            },
            {
              where: {
                donationBinID: req.params.id,
              },
            }
          );
        })
        .then(() => {
          return res.redirect("/donationBin");
        })
        .catch((err) => {
          return res.render("donationBin/editDonationBin", {
            title: "BWG | Edit Donation Bin",
            message: "Page Error!",
          });
        });
    }
  }
);

module.exports = router;
