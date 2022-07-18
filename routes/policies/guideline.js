var express = require("express");
var router = express.Router();

/* GET /policies/guideline page. */
router.get("/", async (req, res, next) => {
  // check if there's an error message in the session
  let messages = req.session.messages || [];
  // clear session messages
  req.session.messages = [];

  return res.render("policies/guideline", {
    title: "BWG | Guidelines",
    errorMessages: messages,
    email: req.session.email,
    auth: req.session.auth, // authorization.
  });
});

module.exports = router;
