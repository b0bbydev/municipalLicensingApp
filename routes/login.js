var express = require("express");
var router = express.Router();
const mysql = require("mysql");
// bcrypt for password encryption.
const bcrypt = require("bcrypt");
// config files.
const db = require("../config/db");

/* GET login page. */
router.get("/", function (req, res, next) {
  res.render("login", {
    title: "BWG",
    // include hideLayout (just bootstrap/css) to hide nav on login view.
    layout: "hideLayout.hbs",
  });
});

/* POST for /login */
router.post("/", (req, res) => {
  // get the values from the login form.
  const username = req.body.username;
  const password = req.body.password;

  // create the connection the db.
  db.getConnection(async (err, connection) => {
    if (err) {
      console.log(err);
    }

    // create the SQL query, and format.
    const sqlSearch = "SELECT * FROM users WHERE username = ?";
    const search_query = mysql.format(sqlSearch, [username]);

    // attempt the search query.
    await connection.query(search_query, async (err, results) => {
      connection.release();

      if (err) {
        console.log(err);
      }

      // if the user doesn't exist when trying to login..
      if (results.length == 0) {
        res.redirect("/register");
      } else {
        // get the password from results
        const hashedPassword = results[0].password;

        // compare it using bcrypt and if successful..
        if (await bcrypt.compare(password, hashedPassword)) {
          // set the username for the session.
          req.session.username = username;
          // redirect user to index page.
          res.redirect("/");
        } else {
          // password is incorrect, redirect to login again.
          res.redirect("/login");
        }
      }
    });
  });
});

module.exports = router;
