var express = require("express");
var router = express.Router();
// models.
const Dropdown = require("../../models/dropdownManager/dropdown");
const RefreshmentVehicleOperator = require("../../models/refreshmentVehicles/refreshmentVehicleOperator");
const RefreshmentVehicleOperatorAddress = require("../../models/refreshmentVehicles/refreshmentVehicleOperatorAddress");
// helper.
const funcHelpers = require("../../config/funcHelpers");
// express-validate.
const { body, param, validationResult } = require("express-validator");

/* GET /refreshmentVehicles/editVehicleOperator/:id */
router.get(
  "/:id",
  param("id").matches(/^\d+$/).trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...),
    if (!errors.isEmpty()) {
      return res.render("refreshmentVehicles/editVehicleOperator", {
        title: "BWG | Edit Vehicle Operator",
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
        order: [["dropdownValue", "ASC"]],
      });

      RefreshmentVehicleOperator.findOne({
        where: {
          refreshmentVehicleOperatorID: req.params.id,
        },
        include: [
          {
            model: RefreshmentVehicleOperatorAddress,
          },
        ],
      })
        .then((results) => {
          return res.render("refreshmentVehicles/editVehicleOperator", {
            title: "BWG | Edit Vehicle Operator",
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
                results.refreshmentVehicleOperatorAddresses[0].streetNumber,
              streetName:
                results.refreshmentVehicleOperatorAddresses[0].streetName,
              town: results.refreshmentVehicleOperatorAddresses[0].town,
              postalCode:
                results.refreshmentVehicleOperatorAddresses[0].postalCode,
            },
          });
        })
        .catch((err) => {
          return res.render("refreshmentVehicles/editVehicleOperator", {
            title: "BWG | Edit Vehicle Operator",
            message: "Page Error!",
            auth: req.session.auth, // authorization.
          });
        });
    }
  }
);

/* POST /refreshmentVehicles/editVehicleOperator/:id */
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
  body("licenseNumber")
    .if(body("licenseNumber").notEmpty())
    .matches(/^[^%<>^$\\;!{}?]+$/)
    .withMessage("Invalid License Number Entry!")
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
      return res.render("refreshmentVehicles/editVehicleOperator", {
        title: "BWG | Edit Vehicle Operator",
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
      RefreshmentVehicleOperator.update(
        {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          phoneNumber: req.body.phoneNumber,
          email: req.body.email,
        },
        {
          where: {
            refreshmentVehicleOperatorID: req.params.id,
          },
        }
      )
        .then(() => {
          // create empty objects to hold data.
          let currentData = {};
          let newData = {};

          // get current data.
          RefreshmentVehicleOperatorAddress.findOne({
            where: {
              refreshmentVehicleOperatorID: req.params.id,
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
              RefreshmentVehicleOperatorAddress.update(
                {
                  streetNumber: req.body.streetNumber,
                  streetName: req.body.streetName,
                  town: req.body.town,
                  postalCode: req.body.postalCode,
                },
                {
                  where: {
                    refreshmentVehicleOperatorID: req.params.id,
                  },
                }
              );
            }
          });
        })
        .then(() => {
          return res.redirect(
            "/refreshmentVehicles/vehicle/" + req.session.refreshmentVehicleID
          );
        })
        .catch((err) => {
          return res.render("refreshmentVehicles/editVehicleOperator", {
            title: "BWG | Edit Vehicle Operator",
            message: "Page Error!",
            auth: req.session.auth, // authorization.
          });
        });
    }
  }
);

module.exports = router;
