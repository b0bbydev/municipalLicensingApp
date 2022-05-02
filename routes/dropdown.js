var express = require("express");
var router = express.Router();
// authHelper.
const { redirectToLogin } = require("../config/authHelpers");
// db config.
const db = require("../config/dbConfig");

/* GET dropdown page. */
router.get("/", redirectToLogin, function (req, res, next) {
  // create mySQL query.
  var query = "SELECT * FROM dropdown";

  db.query(query, function (err, data) {
    if (err) {
      console.log("Error: ", err);
    }
    res.render("dropdown", {
      title: "BWG | Dropdown",
      username: req.session.username,
      data: data,
    });
  });
});

/* POST dropdown value */
router.post("/", redirectToLogin, (req, res, next) => {
  // get data from form
  var value = req.body.value;

  // create the SQL query.
  var query = "INSERT INTO dropdown (value) VALUES (?)";

  // call query on db.
  db.query(query, [value], function (err, data) {
    if (err) {
      console.log(err);
    }
  });
  res.redirect("/dropdown");
});

module.exports = router;
