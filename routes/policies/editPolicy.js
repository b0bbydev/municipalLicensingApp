var express = require("express");
var router = express.Router();
// express-validate.
const { param, validationResult } = require("express-validator");

/* GET /policies/editPolicy/:id */
router.get(
  "/:id",
  param("id").matches(/^\d+$/).trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...).
    if (!errors.isEmpty()) {
      return res.render("policies/editPolicy", {
        title: "BWG | Edit Policy",
        message: "Page Error!",
      });
    } else {
      // check if there's an error message in the session.
      let messages = req.session.messages || [];

      // clear session messages.
      req.session.messages = [];

      return res.render("policies/editPolicy", {
        title: "BWG | Edit Policy",
        errorMessages: messages,
        email: req.session.email,
      });
    }
  }
);

module.exports = router;
