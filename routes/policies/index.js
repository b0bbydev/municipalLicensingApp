var express = require("express");
var router = express.Router();

/* GET /policies */
router.get("/", function (req, res, next) {
  res.render("policies/index", {
    title: "BWG | Policies & Procedures",
    email: req.session.email,
  });
});

module.exports = router;
