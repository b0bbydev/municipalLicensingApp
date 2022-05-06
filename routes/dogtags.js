var express = require("express");
var router = express.Router();
// db config.
var db = require("../config/db");

/* GET login page. */
router.get("/", function (req, res, next) {
  // create mySQL query.
  var query =
    "SELECT * FROM owners LEFT JOIN dogs ON owners.ownerID = dogs.ownerID LIMIT 10";

  // create pagination query.
  var pagQuery =
    "SELECT * FROM owners LEFT JOIN dogs ON owners.ownerID = dogs.ownerID LIMIT 10 OFFSET ?";

  db.query(pagQuery, parseInt([req.query.offset || 0]), function (err, data) {
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
