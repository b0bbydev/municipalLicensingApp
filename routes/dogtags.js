var express = require("express");
var router = express.Router();
// db config.
var db = require("../config/db");
// dbHelpers.
var dbHelpers = require("../config/dbHelpers");

/* GET login page. */
router.get("/", function (req, res, next) {
  // create mySQL query.
  var query = "SELECT * FROM owners LIMIT 10";

  db.query(query, function (err, data) {
    if (err) {
      console.log("Error: ", err);
    }

    res.render("dogtags", {
      title: "BWG | Dog Tags",
      email: req.session.email,
      data: data,
    });
  });
});

module.exports = router;
