var express = require("express");
var router = express.Router();
// models.

/* GET /taxiLicenses/broker/:id */
router.get("/:id", async (req, res, next) => {
  // check if there's an error message in the session
  let messages = req.session.messages || [];
  // clear session messages
  req.session.messages = [];

  // send taxiBrokerID to session.
  req.session.brokerID = req.params.id;

  return res.render("taxiLicenses/broker", {
    title: "BWG | Taxi Licenses",
    errorMessages: messages,
    email: req.session.email,
    auth: req.session.auth, // authorization.
  });
});

module.exports = router;
