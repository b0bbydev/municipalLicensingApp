var express = require("express");
var router = express.Router();
// authHelper middleware.
const { redirectToLogin } = require("../config/authHelpers");
// dbHelpers.
var dbHelpers = require("../config/dbHelpers");
// express-validate.
const { body, param, validationResult } = require("express-validator");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", {
    title: "BWG | Home",
    email: req.session.email,
  });
});

/* POST dropdown value */
router.post(
  "/dropdownManager/form/:id",
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

/* DISABLE dropdown value */
router.get("/dropdownManager/disable/:id", (req, res, next) => {
  // validate to make sure only a number can be passed here.
  if (!req.params.id.match(/^\d+$/)) {
    // if something other than a number is passed, redirect again to dropdown.
    res.redirect("/dropdown");
  } else {
    // db stuff.
    dbHelpers.disableDropdownOption(req.params.id); // req.params.id == dropdownID.

    console.log("");

    // redirect to same page after success.
    res.redirect("/dropdownManager/form/" + req.session.formID);
  }
});

/* ENABLE dropdown value */
router.get("/dropdownManager/enable/:id", async (req, res, next) => {
  // validate to make sure only a number can be passed here.
  if (!req.params.id.match(/^\d+$/)) {
    // if something other than a number is passed, redirect again to dropdown.
    res.redirect("/dropdown");
  } else {
    // db stuff.
    dbHelpers.enableDropdownOption(req.params.id); // req.params.id == dropdownID.

    // redirect to same page after success.
    res.redirect("/dropdownManager/form/" + req.session.formID);
  }
});

/* GET logout page */
router.get("/logout", function (req, res, next) {
  // destory the session.
  req.session.destroy();
  // clear cookies for session.
  res.clearCookie(process.env.SESSION_NAME);
  // redirect back to login.
  res.redirect("/login");
});

module.exports = router;
