var express = require("express");
var router = express.Router();

/* GET /streetClosurePermit */
router.get("/", function (req, res, next) {
  // check if there's an error message in the session
  let messages = req.session.messages || [];
  // clear session messages
  req.session.messages = [];

  return res.render("streetClosurePermit/index", {
    title: "BWG | Street Closure Permits",
    errorMessages: messages,
    email: req.session.email,
    auth: req.session.auth, // authorization.
  });
});

module.exports = router;
