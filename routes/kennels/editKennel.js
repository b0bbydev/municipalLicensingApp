var express = require("express");
var router = express.Router();
// models.
const Dropdown = require("../../models/dropdownManager/dropdown");
const Kennel = require("../../models/kennel/kennel");
const KennelAddress = require("../../models/kennel/kennelAddress");
// helpers.
const funcHelpers = require("../../config/funcHelpers");
// express-validate.
const { body, param, validationResult } = require("express-validator");

/* GET /kennel/editKennel page. */
router.get(
  "/:id",
  param("id").matches(/^\d+$/).trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...),
    if (!errors.isEmpty()) {
      return res.render("kennels/editKennel", {
        title: "BWG | Edit A Kennel",
        message: "Page Error!",
        email: req.session.email,
        auth: req.session.auth, // authorization.
      });
    } else {
      // check if there's an error message in the session
      let messages = req.session.messages || [];
      // clear session messages
      req.session.messages = [];

      // get dropdown values.
      var streets = await Dropdown.findAll({
        where: {
          dropdownFormID: 13, // streets
        },
      });

      Kennel.findOne({
        where: {
          kennelID: req.params.id,
        },
        include: [
          {
            model: KennelAddress,
          },
        ],
      })
        .then((results) => {
          return res.render("kennels/editKennel", {
            title: "BWG | Edit A Kennel",
            message: messages,
            email: req.session.email,
            auth: req.session.auth, // authorization.
            streets: streets,
            // populate input fields with existing values.
            formData: {
              kennelName: results.kennelName,
              phoneNumber: results.phoneNumber,
              email: results.email,
              licenseNumber: results.licenseNumber,
              issueDate: results.issueDate,
              expiryDate: results.expiryDate,
              policeCheck: results.policeCheck,
              photoID: results.photoID,
              acoInspection: results.acoInspection,
              zoningClearance: results.zoningClearance,
              notes: results.notes,
              streetNumber: results.kennelAddresses[0].streetNumber,
              streetName: results.kennelAddresses[0].streetName,
              town: results.kennelAddresses[0].town,
              postalCode: results.kennelAddresses[0].postalCode,
            },
          });
        })
        .catch((err) => {
          return res.render("kennels/editKennel", {
            title: "BWG | Edit A Kennel",
            message: "Page Error!",
          });
        });
    }
  }
);

/* POST /kennel/editKennel */
router.post(
  "/:id",
  param("id").matches(/^\d+$/).trim(),
  body("kennelName")
    .if(body("kennelName").notEmpty())
    .matches(/^[^%<>^$\/\\;!{}?]+$/)
    .withMessage("Invalid Kennel Name Entry!")
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
  body("notes")
    .if(body("notes").notEmpty())
    .matches(/^[^%<>^\/\\;!{}?]+$/)
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

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("kennels/editKennel", {
        title: "BWG | Edit Kennel",
        message: errorArray[0].msg, // custom error message. (should indicate which field has the error.)
        email: req.session.email,
        auth: req.session.auth, // authorization.
        streets: streets,
        // if the form submission is unsuccessful, save their values.
        formData: {
          kennelName: req.body.kennelName,
          phoneNumber: req.body.phoneNumber,
          email: req.body.email,
          licenseNumber: req.body.licenseNumber,
          issueDate: req.body.issueDate,
          expiryDate: req.body.expiryDate,
          policeCheck: req.body.policeCheck,
          photoID: req.body.photoID,
          acoInspection: req.body.acoInspection,
          zoningClearance: req.body.zoningClearance,
          notes: req.body.notes,
          streetNumber: req.body.streetNumber,
          streetName: req.body.streetName,
          town: req.body.town,
          postalCode: req.body.postalCode,
        },
      });
    } else {
      Kennel.update(
        {
          kennelName: req.body.kennelName,
          phoneNumber: req.body.phoneNumber,
          email: req.body.email,
          licenseNumber: req.body.licenseNumber,
          issueDate: funcHelpers.fixEmptyValue(req.body.issueDate),
          expiryDate: funcHelpers.fixEmptyValue(req.body.expiryDate),
          policeCheck: req.body.policeCheck,
          photoID: req.body.photoID,
          acoInspection: req.body.acoInspection,
          zoningClearance: req.body.zoningClearance,
          notes: req.body.notes,
        },
        {
          where: {
            kennelID: req.params.id,
          },
        }
      )
        .then(() => {
          /* begin check for ONLY updating data when a value has changed. */
          // create empty objects to hold data.
          let currentData = {};
          let newData = {};

          // get current data.
          KennelAddress.findOne({
            where: {
              kennelID: req.params.id,
            },
          }).then((results) => {
            currentData = {
              streetNumber: results.streetNumber,
              streetName: results.streetName,
              town: results.town,
              postalCode: results.postalCode,
            };

            // put the NEW data into an object.
            newData = {
              streetNumber: parseInt(req.body.streetNumber),
              streetName: req.body.streetName,
              town: req.body.town,
              postalCode: req.body.postalCode,
            };

            // compare the two objects to check if they contain equal properties. If NOT, then proceed with update.
            if (!funcHelpers.areObjectsEqual(currentData, newData)) {
              // update address.
              KennelAddress.update(
                {
                  streetNumber: req.body.streetNumber,
                  streetName: req.body.streetName,
                  town: req.body.town,
                  postalCode: req.body.postalCode,
                },
                {
                  where: {
                    kennelID: req.params.id,
                  },
                }
              );
            }
          });
        })
        .then(() => {
          return res.redirect("/kennels");
        })
        .catch((err) => {
          return res.render("kennels/editKennel", {
            title: "BWG | Edit A Kennel",
            message: "Page Error!",
          });
        });
    }
  }
);

module.exports = router;
