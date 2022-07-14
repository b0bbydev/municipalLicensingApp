var express = require("express");
var router = express.Router();
// express-validate.
const { body, validationResult } = require("express-validator");

/* GET /addRecord */
router.get("/", async (req, res, next) => {
  // server side validation.
  const errors = validationResult(req);

  // if errors is NOT empty (if there are errors...).
  if (!errors.isEmpty()) {
    return res.render("policies/addRecord", {
      title: "BWG | Add Record",
      message: "Page Error!",
      auth: req.session.auth, // authorization.
    });
  } else {
    // check if there's an error message in the session.
    let messages = req.session.messages || [];
    // clear session messages.
    req.session.messages = [];

    return res.render("policies/addRecord", {
      title: "BWG | Add Record",
      errorMessages: messages,
      email: req.session.email,
      auth: req.session.auth, // authorization.
    });
  }
});

module.exports = router;
