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
router.post("/", async (req, res, next) => {
  // get data from form
  var value = req.body.value;

  // create the SQL query.
  var query = "INSERT INTO dropdown (value) VALUES (?)";

  // call query on db.
  db.query(query, [value], function (err, data) {
    // do something on error.
    if (err) {
      console.log(err);
    }
  });

  // redirect to /dropdown if successful. (reload page)
  res.redirect("/dropdown");
});

module.exports = router;
