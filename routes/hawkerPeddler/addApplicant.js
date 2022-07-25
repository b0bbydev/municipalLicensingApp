var express = require("express");
var router = express.Router();
// models.

/* GET /hawkerPeddler/addApplicant */
router.get("/", async (req, res, next) => {
  // check if there's an error message in the session
  let messages = req.session.messages || [];
  // clear session messages
  req.session.messages = [];

  return res.render("hawkerPeddler/addApplicant", {
    title: "BWG | Add Applicant",
    errorMessages: messages,
    email: req.session.email,
    auth: req.session.auth, // authorization.
  });
});

module.exports = router;
