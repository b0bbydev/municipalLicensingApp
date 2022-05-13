var express = require("express");
var router = express.Router();

/* GET planningDivision page. */
router.get("/", function (req, res, next) {
  res.render("planningDivision", {
    title: "BWG | Planning Division",
    email: req.session.email,
  });
});

module.exports = router;
