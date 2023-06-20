var express = require("express");
var router = express.Router();
// models.
const Adopter = require("../../models/dogAdoptions/adopter");
const AdopterAddress = require("../../models/dogAdoptions/adopterAddress");
const Dropdown = require("../../models/dropdownManager/dropdown");
// express-validate.
const { body, param, validationResult } = require("express-validator");
const funcHelpers = require("../../config/funcHelpers");

/* GET /editAdopter/:id */
router.get(
  "/:id",
  param("id").matches(/^\d+$/).trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...),
    if (!errors.isEmpty()) {
      return res.render("dogAdoptions/editAdopter", {
        title: "BWG | Edit Adopter",
        message: "Page Error!",
        email: req.session.email,
        auth: req.session.auth, // authorization.
      });
    } else {
      // check if there's an error message in the session,
      let messages = req.session.messages || [];
      // clear session messages,
      req.session.messages = [];

      // send adopterID to session; should be safe to do so here after validation.
      req.session.adopterID = req.params.id;

      // get streets.
      var streets = await Dropdown.findAll({
        where: {
          dropdownFormID: 13, // streets
        },
        order: [["dropdownValue", "ASC"]],
      });

      // populate input fields with existing values.
      Adopter.findOne({
        where: {
          adopterID: req.session.adopterID,
        },
        include: [
          {
            model: AdopterAddress,
          },
        ],
      })
        .then((results) => {
          return res.render("dogAdoptions/editAdopter", {
            title: "BWG | Edit Adopter",
            message: messages,
            email: req.session.email,
            auth: req.session.auth, // authorization.
            streets: streets,
            // existing values.
            adopterInfo: {
              firstName: results.firstName,
              lastName: results.lastName,
              phoneNumber: results.phoneNumber,
              email: results.email,
              streetNumber: results.adopterAddresses[0].streetNumber,
              streetName: results.adopterAddresses[0].streetName,
              town: results.adopterAddresses[0].town,
              postalCode: results.adopterAddresses[0].postalCode,
            },
          });
        })
        .catch((err) => {
          return res.render("dogAdoptions/editAdopter", {
            title: "BWG | Edit Adopter",
            message: "Page Error!",
            auth: req.session.auth, // authorization.
          });
        });
    }
  }
);

/* POST /editAdopter/:id */
router.post(
  "/:id",
  param("id").matches(/^\d+$/).trim(),
  body("firstName")
    .if(body("firstName").notEmpty())
    .matches(/^[^%<>^$\\;!{}?]+$/)
    .withMessage("Invalid First Name Entry!")
    .trim(),
  body("lastName")
    .if(body("lastName").notEmpty())
    .matches(/^[^%<>^$\\;!{}?]+$/)
    .withMessage("Invalid Last Name Entry!")
    .trim(),
  body("phoneNumber")
    .if(body("phoneNumber").notEmpty())
    .matches(/^[^%<>^$\\;!{}?]+$/)
    .withMessage("Invalid Phone Number Entry!")
    .trim(),
  body("email")
    .if(body("email").notEmpty())
    .isEmail()
    .withMessage("Invalid Email Entry!")
    .trim(),
  body("streetNumber")
    .if(body("streetNumber").notEmpty())
    .matches(/^[^%<>^$\\;!{}?]+$/)
    .withMessage("Invalid Street Number Entry!")
    .trim(),
  body("streetName")
    .if(body("streetName").notEmpty())
    .matches(/^[^%<>^$\\;!{}?]+$/)
    .withMessage("Invalid Street Name Entry!")
    .trim(),
  body("town")
    .if(body("town").notEmpty())
    .matches(/^[^%<>^$\\;!{}?]+$/)
    .withMessage("Invalid Town Entry!")
    .trim(),
  body("postalCode")
    .if(body("postalCode").notEmpty())
    .matches(/^[^%<>^$\\;!{}?]+$/)
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
      order: [["dropdownValue", "ASC"]],
    });

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("dogAdoptions/editAdopter", {
        title: "BWG | Edit Adopter",
        message: errorArray[0].msg,
        email: req.session.email,
        auth: req.session.auth, // authorization.
        streets: streets,
        // if the form submission is unsuccessful, save their values.
        adopterInfo: {
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
      /* begin check for ONLY updating data when a value has changed. */
      // create empty objects to hold data.
      let currentData = {};
      let newData = {};

      // get current data.
      Adopter.findOne({
        where: {
          adopterID: req.params.id,
        },
      })
        .then((results) => {
          currentData = {
            firstName: results.firstName,
            lastName: results.lastName,
            homePhone: results.homePhone,
            cellPhone: results.cellPhone,
            workPhone: results.workPhone,
            email: results.email,
          };

          // put the NEW data into an object.
          // fixEmptyValue() in this case will replace any 'undefined' values with null.
          // which is required when comparing objects as null != defined, making them techinically different.
          newData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            homePhone: req.body.homePhone,
            cellPhone: req.body.cellPhone,
            workPhone: req.body.workPhone,
            email: req.body.email,
          };

          // compare the two objects to check if they contain equal properties. If NOT (false), then proceed with update.
          if (!funcHelpers.areObjectsEqual(currentData, newData)) {
            // update owner.
            Adopter.update(
              {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                homePhone: req.body.homePhone,
                cellPhone: req.body.cellPhone,
                workPhone: req.body.workPhone,
                email: req.body.email,
              },
              {
                where: {
                  adopterID: req.session.adopterID,
                },
              }
            );
          }
        })
        .then(() => {
          // create empty objects to hold data.
          let currentData = {};
          let newData = {};

          // get current data.
          Adopter.findOne({
            where: {
              adopterID: req.params.id,
            },
            include: [
              {
                model: AdopterAddress,
              },
            ],
          }).then((results) => {
            // put the CURRENT data into an object.
            currentData = {
              streetNumber: results.addresses[0].dataValues.streetNumber,
              streetName: results.addresses[0].dataValues.streetName,
              poBoxAptRR: results.addresses[0].dataValues.poBoxAptRR,
              town: results.addresses[0].dataValues.town,
              postalCode: results.addresses[0].dataValues.postalCode,
            };

            // put the NEW data into an object.
            newData = {
              streetNumber: parseInt(req.body.streetNumber),
              streetName: req.body.streetName,
              poBoxAptRR: req.body.poBoxAptRR,
              town: req.body.town,
              postalCode: req.body.postalCode,
            };

            // compare the two objects to check if they contain equal properties. If NOT, then proceed with update.
            if (!funcHelpers.areObjectsEqual(currentData, newData)) {
              // update Address.
              AdopterAddress.update(
                {
                  streetNumber: req.body.streetNumber,
                  streetName: req.body.streetName,
                  poBoxAptRR: req.body.poBoxAptRR,
                  town: req.body.town,
                  postalCode: req.body.postalCode,
                },
                {
                  where: {
                    adopterID: req.session.adopterID,
                  },
                }
              );
            }
          });
        })
        .then(() => {
          return res.redirect("/dogtags");
        })
        .catch((err) => {
          return res.render("dogAdoptions/editAdopter", {
            title: "BWG | Edit Adopter",
            message: "Page Error!",
            auth: req.session.auth, // authorization.
          });
        });
    }
  }
);

module.exports = router;
