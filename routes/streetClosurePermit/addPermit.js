var express = require("express");
var router = express.Router();

/* GET /streetClosurePermit/addPermit */
router.get("/", function (req, res, next) {
  // check if there's an error message in the session
  let messages = req.session.messages || [];
  // clear session messages
  req.session.messages = [];

  return res.render("streetClosurePermit/addPermit", {
    title: "BWG | Add Street Closure Permit",
    errorMessages: messages,
    email: req.session.email,
    auth: req.session.auth, // authorization.
  });
});

module.exports = router;
