var express = require("express");
var router = express.Router();

/* GET addLicense page. */
router.get("/", async (req, res, next) => {
  // check if there's an error message in the session
  let messages = req.session.messages || [];

  // clear session messages
  req.session.messages = [];

  res.render("dogtags/addLicense", {
    title: "BWG | Owner",
    errorMessages: messages,
    email: req.session.email,
  });
});

module.exports = router;
