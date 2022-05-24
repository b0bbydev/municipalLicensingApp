var express = require("express");
var router = express.Router();
const { redirectToLogin } = require("../../config/authHelpers");
// dbHelpers.
var dbHelpers = require("../../config/dbHelpers");
// express-validate.
const { param, body, validationResult } = require("express-validator");

/* GET dropdown page. */
router.get("/", async (req, res, next) => {
  // check if there's an error message in the session
  let messages = req.session.messages || [];

  // clear session messages
  req.session.messages = [];

  var data = await dbHelpers.getAllForms();

  return res.render("dropdownManager/index", {
    title: "BWG | Dropdown Manager",
    errorMessages: messages,
    email: req.session.email,
    data: data,
  });
});

router.get(
  "/form/:id",
  param("id").matches(/^\d+$/).trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("dropdownManager", {
        title: "BWG | Dropdown Manager",
        message: "Error!",
        email: req.session.email,
      });
    } else {
      // check if there's an error message in the session
      let messages = req.session.messages || [];

      // clear session messages
      req.session.messages = [];

      // store formID in session to use in other endpoints.
      req.session.formID = req.params.id;

      var data = await dbHelpers.getAllFromDropdown(req.session.formID);
      var formName = await dbHelpers.getFormNameFromFormID(req.session.formID);

      return res.render("dropdownManager/form", {
        title: "BWG | " + formName[0].formName,
        errorMessages: messages,
        email: req.session.email,
        formName: formName[0].formName,
        data: data,
      });
    }
  }
);

/* POST dropdownManager/form/:id */
router.post(
  "/form/:id",
  body("value")
    .matches(/^[^'";=_()*&%$#!<>\/\^\\]*$/)
    .trim(),
  param("id").matches(/^\d+$/).trim(),
  function (req, res, next) {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      // render dropdown page with error message.
      return res.render("dropdownManager/index", {
        title: "BWG | Dropdown Manager",
        message: "Invalid entry!",
      });
    } else {
      // insert into db after validation middleware.
      dbHelpers.insertIntoDropdown(req.body.value, req.session.formID);

      // redirect to same page if successful.
      res.redirect("/dropdownManager/form/" + req.session.formID);
    }
  }
);

/* DISABLE dropdownManager/disable/:id */
router.get(
  "/disable/:id",
  param("id").matches(/^\d+$/).trim(),
  (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      // render dropdown page with error message.
      return res.render("dropdownManager/index", {
        title: "BWG | Dropdown Manager",
        message: "Invalid entry!",
      });
    } else {
      // after validation, disable dropdown option.
      dbHelpers.disableDropdownOption(req.params.id); // req.params.id == dropdownID.

      // redirect to same page after success.
      res.redirect("/dropdownManager/form/" + req.session.formID);
    }
  }
);

/* ENABLE dropdownManager/enable/:id */
router.get(
  "/enable/:id",
  param("id").matches(/^\d+$/).trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      // render dropdown page with error message.
      return res.render("dropdownManager/index", {
        title: "BWG | Dropdown Manager",
        message: "Invalid entry!",
      });
    } else {
      // after validation, enable dropdown option.
      dbHelpers.enableDropdownOption(req.params.id); // req.params.id == dropdownID.

      // redirect to same page after success.
      res.redirect("/dropdownManager/form/" + req.session.formID);
    }
  }
);

module.exports = router;
