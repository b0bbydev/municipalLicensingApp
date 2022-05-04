var express = require("express");
var router = express.Router();
// authHelper.
const { redirectToLogin } = require("../config/authHelpers");
// db config.
var db = require("../config/db");

/* GET dropdown page. */
router.get("/", function (req, res, next) {
  // create mySQL query.
  var query = "SELECT * FROM dropdown";

  db.query(query, function (err, data) {
    if (err) {
      console.log("Error: ", err);
    }
    res.render("dropdown", {
      title: "BWG | Dropdown",
      email: req.session.email,
      data: data,
    });
  });
});

/* POST dropdown value */
router.post("/", (req, res, next) => {
  // get data from form
  var value = req.body.value;
  var userID = 2;

  // create the SQL query.
  var query = "INSERT INTO dropdown (userID, value) VALUES (?, ?)";

  // call query on db.
  db.query(query, [userID, value], function (err, data) {
    if (err) {
      console.log(err);
    }
  });

  res.redirect("/dropdown");
});

module.exports = router;
