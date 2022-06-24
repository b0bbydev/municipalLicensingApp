var express = require("express");
var router = express.Router();
const { isLoggedIn } = require("../../config/authHelpers");
// express-validate.
const { param, body, validationResult } = require("express-validator");
// request limiter.
const limiter = require("../../config/limiter");

/* GET /policies/editGuideline/:id */
router.get(
  "/:id",
  limiter,
  param("id").matches(/^\d+$/).trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...).
    if (!errors.isEmpty()) {
      return res.render("policies/editGuideline", {
        title: "BWG | Edit Guideline",
        message: "Page Error!",
      });
    } else {
      // check if there's an error message in the session.
      let messages = req.session.messages || [];
      // clear session messages.
      req.session.messages = [];

      return res.render("policies/editGuideline", {
        title: "BWG | Edit Guideline",
        errorMessages: messages,
        email: req.session.email,
        dogAuth: req.session.dogAuth,
        admin: req.session.admin,
      });
    }
  }
);

module.exports = router;
