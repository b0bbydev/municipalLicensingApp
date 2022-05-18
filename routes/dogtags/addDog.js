var express = require("express");
var router = express.Router();

/* GET addDog page. */
router.get("/", async (req, res, next) => {
  // check if there's an error message in the session
  let messages = req.session.messages || [];

  // clear session messages
  req.session.messages = [];

  res.render("dogtags/addDog", {
    title: "BWG | Add Dog",
    errorMessages: messages,
    email: req.session.email,
  });
});

module.exports = router;
