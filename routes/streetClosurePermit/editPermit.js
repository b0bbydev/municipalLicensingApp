var express = require("express");
var router = express.Router();
// models.
const StreetClosurePermit = require("../../models/streetClosurePermits/streetClosurePermit");
// helpers.
var funcHelpers = require("../../config/funcHelpers");
// express-validate.
const { body, validationResult } = require("express-validator");

/* GET /streetClosurePermit/editPermit/:id */
router.get("/:id", function (req, res, next) {
  // check if there's an error message in the session
  let messages = req.session.messages || [];
  // clear session messages
  req.session.messages = [];

  return res.render("streetClosurePermit/editPermit", {
    title: "BWG | Edit Street Closure Permit",
    errorMessages: messages,
    email: req.session.email,
    auth: req.session.auth, // authorization.
  });
});

module.exports = router;
