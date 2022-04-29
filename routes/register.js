var express = require("express");
var router = express.Router();

/* GET register page. */
router.get("/", function (req, res, next) {
  res.render("register", {
    title: "BWG",
    // include hideLayout (just bootstrap/css) to hide nav on login view.
    layout: "hideLayout.hbs",
  });
});

module.exports = router;
