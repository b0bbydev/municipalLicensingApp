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
      dbHelpers.insertIntoDropdown(req.body.value, req.params.id);

      // redirect to same page if successful.
      res.redirect("/dropdownManager/form/" + req.params.id);
    }
  }
);

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
