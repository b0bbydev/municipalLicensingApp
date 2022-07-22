var express = require("express");
var router = express.Router();

/* GET /hawkerPeddler page. */
router.get("/", async (req, res, next) => {
  // check if there's an error message in the session
  let messages = req.session.messages || [];
  // clear session messages
  req.session.messages = [];

  return res.render("hawkerPeddler/index", {
    title: "BWG | Hawker & Peddler",
    errorMessages: messages,
    email: req.session.email,
    auth: req.session.auth, // authorization.
  });
});

module.exports = router;
