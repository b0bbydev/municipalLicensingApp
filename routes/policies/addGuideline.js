var express = require("express");
var router = express.Router();
// authHelper middleware.
const {
  dogLicenseAuth,
  adminAuth,
  isLoggedIn,
} = require("../../config/authHelpers");
// request limiter.
const limiter = require("../../config/limiter");

/* GET home page. */
router.get("/", function (req, res, next) {
  // check if there's an error message in the session
  let messages = req.session.messages || [];
  // clear session messages
  req.session.messages = [];

  return res.render("policies/addGuideline", {
    title: "BWG | Add Guideline",
    errorMessages: messages,
    email: req.session.email,
    dogAuth: req.session.dogAuth, // authorization.
    admin: req.session.admin, // authorization.
  });
});

module.exports = router;
