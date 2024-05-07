var express = require("express");
var router = express.Router();
// models.
const Dropdown = require("../../models/dropdownManager/dropdown");
const HawkerPeddlerOperator = require("../../models/hawkerPeddler/hawkerPeddlerOperator");
const HawkerPeddlerOperatorAddress = require("../../models/hawkerPeddler/hawkerPeddleOperatorAddress");
// helpers.
const funcHelpers = require("../../config/funcHelpers");
// express-validate.
const { body, param, validationResult } = require("express-validator");

/* GET /hawkerPeddler/editOperator/:id */
router.get(
  "/:id",
  param("id").matches(/^\d+$/).trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...),
    if (!errors.isEmpty()) {
      return res.render("hawkerPeddler/editOperator", {
        title: "BWG | Edit Operator",
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
        order: [["dropdownValue", "ASC"]],
      });

      HawkerPeddlerOperator.findOne({
        where: {
          hawkerPeddlerOperatorID: req.params.id,
        },
        include: [
          {
            model: HawkerPeddlerOperatorAddress,
          },
        ],
      })
        .then((results) => {
          return res.render("hawkerPeddler/editOperator", {
            title: "BWG | Edit Operator",
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
              streetNumber:
                results.hawkerPeddlerOperatorAddresses[0].streetNumber,
              streetName: results.hawkerPeddlerOperatorAddresses[0].streetName,
              town: results.hawkerPeddlerOperatorAddresses[0].town,
              postalCode: results.hawkerPeddlerOperatorAddresses[0].postalCode,
            },
          });
        })
        .catch((err) => {
          return res.render("hawkerPeddler/editOperator", {
            title: "BWG | Edit Operator",
            message: "Page Error!",
            auth: req.session.auth, // authorization.
          });
        });
    }
  }
);

/* POST /hawkerPeddler/editOperator/:id */
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

    // if errors is NOT empty (if there are errors...).
    if (!errors.isEmpty()) {
      return res.render("hawkerPeddler/editOperator", {
        title: "BWG | Edit Operator",
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
      HawkerPeddlerOperator.findOne({
        where: {
          hawkerPeddlerOperatorID: req.params.id,
        },
      })
        .then((results) => {
          // put the CURRENT data into an object.
          currentData = {
            firstName: results.dataValues.firstName,
            lastName: results.dataValues.lastName,
            phoneNumber: results.dataValues.phoneNumber,
            email: results.dataValues.email,
          };
          // put the NEW data into an object.
          // fixEmptyValue() in this case will replace any 'undefined' values with null.
          // which is required when comparing objects as null != defined, making them techinically different.
          newData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email,
          };

          // compare the two objects to check if they contain equal properties. If NOT (false), then proceed with update.
          if (!funcHelpers.areObjectsEqual(currentData, newData)) {
            HawkerPeddlerOperator.update(
              {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                phoneNumber: req.body.phoneNumber,
                email: req.body.email,
              },
              {
                where: {
                  hawkerPeddlerOperatorID: req.params.id,
                },
              }
            );
          }
        })
        .then(() => {
          /* begin check for ONLY updating data when a value has changed. */
          // create empty objects to hold data.
          let currentData = {};
          let newData = {};

          // get current data.
          HawkerPeddlerOperatorAddress.findOne({
            where: {
              hawkerPeddlerOperatorID: req.params.id,
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
              HawkerPeddlerOperatorAddress.update(
                {
                  streetNumber: req.body.streetNumber,
                  streetName: req.body.streetName,
                  town: req.body.town,
                  postalCode: req.body.postalCode,
                },
                {
                  where: {
                    hawkerPeddlerOperatorID: req.params.id,
                  },
                }
              );
            }
          });
        })
        .then(() => {
          return res.redirect(
            "/hawkerPeddler/business/" + req.session.hawkerPeddlerBusinessID
          );
        })
        .catch((err) => {
          return res.render("hawkerPeddler/editOperator", {
            title: "BWG | Edit Operator",
            message: "Page Error!" + err,
            auth: req.session.auth, // authorization.
          });
        });
    }
  }
);

module.exports = router;
