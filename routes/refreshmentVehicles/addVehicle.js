var express = require("express");
var router = express.Router();
// models.
const RefreshmentVehicle = require("../../models/refreshmentVehicles/refreshmentVehicle");
// helper.
const funcHelpers = require("../../config/funcHelpers");
// express-validate.
const { body, validationResult } = require("express-validator");

/* GET /refreshmentVehicles/addVehicle */
router.get("/", async (req, res, next) => {
  // check if there's an error message in the session
  let messages = req.session.messages || [];
  // clear session messages
  req.session.messages = [];

  return res.render("refreshmentVehicles/addVehicle", {
    title: "BWG | Add Vehicle",
    errorMessages: messages,
    email: req.session.email,
    auth: req.session.auth, // authorization.
  });
});

/* POST /refreshmentVehicles/addVehicle */
router.post(
  "/",
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
      return res.render("refreshmentVehicles/addVehicle", {
        title: "BWG | Add Vehicle",
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
      RefreshmentVehicle.create({
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
      })
        .then(res.redirect("/refreshmentVehicles"))
        .catch((err) => {
          return res.render("refreshmentVehicles/addVehicle", {
            title: "BWG | Add Vehicle",
            message: "Page Error!",
          });
        });
    }
  }
);

module.exports = router;
