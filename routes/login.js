var express = require("express");
var router = express.Router();
const mysql = require("mysql");
// bcrypt for password encryption.
const bcrypt = require("bcrypt");
// config files.
const db = require("../config/db");
// express-validate.
const { body, validationResult } = require("express-validator");

/* GET login page. */
router.get("/", function (req, res, next) {
  // check if there's an error message in the session
  let messages = req.session.messages || [];

  // clear session messages
  req.session.messages = [];

  res.render("login", {
    title: "BWG | Login",
    errorMessages: messages,
    layout: "hideLayout.hbs",
  });
});

/* POST for /login */ /* note the middleware from express-validate. */
router.post("/", body("email").isEmail().normalizeEmail(), (req, res) => {
  // server side validation.
  const errors = validationResult(req);

  // if errors is NOT empty (if there are errors...)
  if (!errors.isEmpty()) {
    // render login page with error message.
    res.render("login", {
      title: "BWG",
      message: "Invalid email/password combination!",
      layout: "hideLayout.hbs",
    });
    // assuming the email is valid (will have passed client and server side validation at this point).
  } else {
    // get the values from the login form.
    const email = req.body.email;
    const password = req.body.password;

    // create the connection the db.
    db.getConnection(async (err, connection) => {
      // if there are errors, log to console.
      if (err) {
        console.log(err);
      }

      // create the SQL query, and format.
      const sqlSearch = "SELECT * FROM users WHERE email = ?";
      const search_query = mysql.format(sqlSearch, [email]);

      // attempt the search query.
      await connection.query(search_query, async (err, results) => {
        // if there are errors, log to console.
        if (err) {
          console.log(err);
        }

        // close the connection.
        connection.release();

        // if the user doesn't exist when trying to login.
        if (results.length == 0) {
          // render the login page again, with error message.
          res.render("login", {
            layout: "hideLayout.hbs",
            message: "User doesn't exist!",
          });
        } else {
          // get the password from results
          const hashedPassword = results[0].password;

          // compare it using bcrypt.
          if (await bcrypt.compare(password, hashedPassword)) {
            // login is successful at this point.
            // set the email for the session.
            req.session.email = email;
            // redirect user to index page upon successful login.
            res.redirect("/");
          } else {
            // password is incorrect, render login again with error message.
            res.render("login", {
              layout: "hideLayout.hbs",
              message: "Invalid email/password combination!",
            });
          }
        }
      });
    });
  }
});

module.exports = router;
