var express = require("express");
var router = express.Router();
// models.
// express-validate.
const { body, validationResult } = require("express-validator");

/* GET /taxiLicenses/addBroker */
router.get("/", function (req, res, next) {
  // check if there's an error message in the session
  let messages = req.session.messages || [];
  // clear session messages
  req.session.messages = [];

  return res.render("taxiLicenses/addBroker", {
    title: "BWG | Add Taxi Broker",
    errorMessages: messages,
    email: req.session.email,
    auth: req.session.auth, // authorization.
  });
});

module.exports = router;
