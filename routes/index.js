var express = require("express");
var router = express.Router();
var db = require("../config/config");

/* GET home page. */
router.get("/", function (req, res, next) {
  // create mySQL query.
  var query = "SELECT * FROM dropdown";

  db.query(query, function (err, data) {
    if (err) {
      console.log("Error: ", err);
    }
    res.render("index", { title: "BWG", data: data });
  });
});

/* DELETE dropdown value */
router.get("/delete/:id", (req, res, next) => {
  // *SHOULD VALIDATE THIS*
  var dropdownID = req.params.id;

  // create the query.
  var query = "DELETE FROM dropdown WHERE dropdownID = ?";

  // call query on db.
  db.query(query, [dropdownID], function (err, data) {
    if (err) {
      console.log(err);
    }
  });

  // redirect to home after success.
  res.redirect("/");
});

module.exports = router;
