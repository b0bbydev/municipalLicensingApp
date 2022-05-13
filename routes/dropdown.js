var express = require("express");
var router = express.Router();
const { redirectToLogin } = require("../config/authHelpers");
// db config.
var db = require("../config/db");
// express-validate.
const { body, validationResult } = require("express-validator");

/* GET dropdown page. */
router.get("/", function (req, res, next) {
  // check if there's an error message in the session
  let messages = req.session.messages || [];

  // clear session messages
  req.session.messages = [];

  // create mySQL query.
  var query = "SELECT * FROM dropdown";

  db.query(query, function (err, data) {
    if (err) {
      console.log("Error: ", err);
    }
    res.render("dropdown", {
      title: "BWG | Dropdown",
      errorMessages: messages,
      email: req.session.email,
      data: data,
    });
  });
});

/* POST dropdown value */
router.post(
  "/",
  body("value")
    .matches(/^[^'";=_()*&%$#!<>\/\^\\]*$/)
    .trim(),
  function (req, res, next) {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      // render dropdown page with error message.
      return res.render("dropdown", {
        title: "BWG | Dropdown",
        message: "Invalid entry!",
      });
    } else {
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
    }
  }
);

module.exports = router;
