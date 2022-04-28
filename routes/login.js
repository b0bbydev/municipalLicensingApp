var express = require("express");
var router = express.Router();

/* GET login page. */
router.get("/", function (req, res, next) {
  res.render("login", {
    title: "BWG",
    // include hideLayout (just bootstrap/css) to hide nav on login view.
    layout: "hideLayout.hbs",
  });
});

module.exports = router;
