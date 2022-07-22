var express = require("express");
var router = express.Router();

/* GET /hawkerPeddler/addBusiness page. */
router.get("/:id", async (req, res, next) => {
  // check if there's an error message in the session
  let messages = req.session.messages || [];
  // clear session messages
  req.session.messages = [];

  return res.render("hawkerPeddler/addBusiness", {
    title: "BWG | Add Business",
    errorMessages: messages,
    email: req.session.email,
    auth: req.session.auth, // authorization.
  });
});

module.exports = router;
