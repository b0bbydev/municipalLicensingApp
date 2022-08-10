var express = require("express");
var router = express.Router();
// models.
const RefreshmentVehicle = require("../../models/refreshmentVehicles/refreshmentVehicle");
// helper.
const funcHelpers = require("../../config/funcHelpers");
// express-validate.
const { body, param, validationResult } = require("express-validator");

/* GET /refreshmentVehicles/editVehicle/:id */
router.get(
  "/:id",
  param("id").matches(/^\d+$/).trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...),
    if (!errors.isEmpty()) {
      return res.render("refreshmentVehicles/editVehicle", {
        title: "BWG | Edit Vehicle",
        message: "Page Error!",
        email: req.session.email,
        auth: req.session.auth, // authorization.
      });
    } else {
      // check if there's an error message in the session
      let messages = req.session.messages || [];
      // clear session messages
      req.session.messages = [];

      RefreshmentVehicle.findOne({
        where: {
          refreshmentVehicleID: req.params.id,
        },
      })
        .then((results) => {
          return res.render("refreshmentVehicles/editVehicle", {
            title: "BWG | Edit Vehicle",
            message: messages,
            email: req.session.email,
            auth: req.session.auth, // authorization.
            // populate input fields with existing values.
            formData: {
              registeredBusinessName: results.registeredBusinessName,
              operatingBusinessName: results.operatingBusinessName,
              issueDate: results.issueDate,
              expiryDate: results.expiryDate,
              specialEvent: results.specialEvent,
              policeVSC: results.policeVSC,
              photoID: results.photoID,
              driversAbstract: results.driversAbstract,
              safetyCertificate: results.safetyCertificate,
              vehicleOwnership: results.vehicleOwnership,
              citizenship: results.citizenship,
              insurance: results.insurance,
              zoningClearance: results.zoningClearance,
              fireApproval: results.fireApproval,
              healthInspection: results.healthInspection,
              itemsForSale: results.itemsForSale,
              notes: results.notes,
            },
          });
        })
        .catch((err) => {
          return res.render("refreshmentVehicles/editVehicle", {
            title: "BWG | Edit Vehicle",
            message: "Page Error!",
          });
        });
    }
  }
);

/* POST /refreshmentVehicles/editVehicle/:id */
router.post(
  "/:id",
  param("id").matches(/^\d+$/).trim(),
  body("registeredBusinessName")
    .if(body("registeredBusinessName").notEmpty())
    .matches(/^[^%<>^$\/\\;!{}?]+$/)
    .withMessage("Invalid Registered Business Name Entry!")
    .trim(),
  body("operatingBusinessName")
    .if(body("operatingBusinessName").notEmpty())
    .matches(/^[^%<>^$\/\\;!{}?]+$/)
    .withMessage("Invalid Operating Business Name Entry!")
    .trim(),
  body("itemsForSale")
    .if(body("itemsForSale").notEmpty())
    .matches(/^[\r\na-zA-Z0-9\/\-,.:"' ]+/)
    .withMessage("Invalid Items For Sale Entry!")
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

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("refreshmentVehicles/editVehicle", {
        title: "BWG | Edit Vehicle",
        message: errorArray[0].msg, // custom error message. (should indicate which field has the error.)
        email: req.session.email,
        auth: req.session.auth, // authorization.
        // if the form submission is unsuccessful, save their values.
        formData: {
          registeredBusinessName: req.body.registeredBusinessName,
          operatingBusinessName: req.body.operatingBusinessName,
          issueDate: req.body.issueDate,
          expiryDate: req.body.expiryDate,
          specialEvent: req.body.specialEvent,
          policeVSC: req.body.policeVSC,
          photoID: req.body.photoID,
          driversAbstract: req.body.driversAbstract,
          safetyCertificate: req.body.safetyCertificate,
          vehicleOwnership: req.body.vehicleOwnership,
          citizenship: req.body.citizenship,
          insurance: req.body.insurance,
          zoningClearance: req.body.zoningClearance,
          fireApproval: req.body.fireApproval,
          healthInspection: req.body.healthInspection,
          itemsForSale: req.body.itemsForSale,
          notes: req.body.notes,
        },
      });
    } else {
      RefreshmentVehicle.update(
        {
          registeredBusinessName: req.body.registeredBusinessName,
          operatingBusinessName: req.body.operatingBusinessName,
          issueDate: funcHelpers.fixEmptyValue(req.body.issueDate),
          expiryDate: funcHelpers.fixEmptyValue(req.body.expiryDate),
          specialEvent: req.body.specialEvent,
          policeVSC: req.body.policeVSC,
          photoID: req.body.photoID,
          driversAbstract: req.body.driversAbstract,
          safetyCertificate: req.body.safetyCertificate,
          vehicleOwnership: req.body.vehicleOwnership,
          citizenship: req.body.citizenship,
          insurance: req.body.insurance,
          zoningClearance: req.body.zoningClearance,
          fireApproval: req.body.fireApproval,
          healthInspection: req.body.healthInspection,
          itemsForSale: req.body.itemsForSale,
          notes: req.body.notes,
        },
        {
          where: {
            refreshmentVehicleID: req.params.id,
          },
        }
      )
        .then(() => {
          return res.redirect("/refreshmentVehicles");
        })
        .catch((err) => {
          return res.render("refreshmentVehicles/editVehicle", {
            title: "BWG | Edit Vehicle",
            message: "Page Error!",
          });
        });
    }
  }
);

module.exports = router;
