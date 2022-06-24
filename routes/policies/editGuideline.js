var express = require("express");
var router = express.Router();
const { isLoggedIn } = require("../../config/authHelpers");
// express-validate.
const { param, body, validationResult } = require("express-validator");
// express-rate-limit.
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: "Too many requests! Slow down!",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

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
