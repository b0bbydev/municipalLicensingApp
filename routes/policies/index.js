var express = require("express");
var router = express.Router();
const { redirectToLogin } = require("../../config/authHelpers");
// dbHelpers.
var dbHelpers = require("../../config/dbHelpers");

/* GET /policies */
router.get("/", async (req, res, next) => {
  // check if there's an error message in the session
  let messages = req.session.messages || [];

  // clear session messages
  req.session.messages = [];

  // get all the policies.
  var data = await dbHelpers.getAllPolicies();

  return res.render("policies/index", {
    title: "BWG | Policies & Procedures",
    errorMessages: messages,
    email: req.session.email,
    data: data,
  });
});

module.exports = router;
