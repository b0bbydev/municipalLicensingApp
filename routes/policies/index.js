var express = require("express");
var router = express.Router();
const { redirectToLogin } = require("../../config/authHelpers");
// express-validate.
const { body, validationResult } = require("express-validator");

/* GET /policies */
router.get("/", async (req, res, next) => {
  // check if there's an error message in the session
  let messages = req.session.messages || [];

  // clear session messages
  req.session.messages = [];

  // get all the policies.

  return res.render("policies", {
    title: "BWG | Policies & Procedures",
    errorMessages: messages,
    email: req.session.email,
    //data: data,
    //queryCount: "Records returned: " + data.length,
  });
});

/* POST /policies */
router.post(
  "/",
  // validate all input fields.
  body("filterCategory")
    .matches(/^[^'";=_()*&%$#!<>\/\^\\]*$/)
    .trim(),
  body("filterValue")
    .matches(/^[^'";=_()*&%$#!<>\/\^\\]*$/)
    .trim(),
  function (req, res, next) {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("policies", {
        title: "BWG | Policies",
        message: "Filtering Error!",
        email: req.session.email,
      });
    } else {
      if (
        // ALL supplied filters.
        req.body.filterCategory &&
        req.body.filterValue
      ) {
        // db stuff.
      } else if (
        // NO supplied filters.
        !req.body.filterCategory &&
        !req.body.filterValue
      ) {
        return res.render("policies", {
          title: "BWG | Policies",
          message: "Please provide a value to filter by!",
          email: req.session.email,
        });
        // else something weird happens..
      } else {
        return res.render("policies", {
          title: "BWG | Policies",
          message: "Please ensure both filtering conditions are valid!",
          email: req.session.email,
        });
      }
    }
  }
); // end of post.

/* GET /policies/policy/:id */
router.get("/policy/:id", async (req, res, next) => {
  // check if there's an error message in the session
  let messages = req.session.messages || [];

  // clear session messages
  req.session.messages = [];

  return res.render("policies/policy", {
    title: "BWG | Policy",
    errorMessages: messages,
    email: req.session.email,
  });
});

module.exports = router;
