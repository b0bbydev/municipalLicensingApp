var express = require("express");
var router = express.Router();
// express-validate.
const { body, param, validationResult } = require("express-validator");

/* GET /addDog/:id */
router.get("/", async (req, res, next) => {
  // server side validation.
  const errors = validationResult(req);

  // if errors is NOT empty (if there are errors...).
  if (!errors.isEmpty()) {
    return res.render("policies/addPolicy", {
      title: "BWG | Add Policy",
      message: "Page Error!",
    });
  } else {
    // check if there's an error message in the session.
    let messages = req.session.messages || [];

    // clear session messages.
    req.session.messages = [];

    return res.render("policies/addPolicy", {
      title: "BWG | Add Policy",
      errorMessages: messages,
      email: req.session.email,
    });
  }
});

module.exports = router;
