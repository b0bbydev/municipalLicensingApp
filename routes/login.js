var express = require("express");
var router = express.Router();
const mysql = require("mysql");
// bcrypt for password encryption.
const bcrypt = require("bcrypt");
// config files.
const db = require("../config/db");

/* GET login page. */
router.get("/", function (req, res, next) {
  // check if there's an error message in the session
  let messages = req.session.messages || [];

  // clear session messages
  req.session.messages = [];

  res.render("login", {
    title: "BWG",
    errorMessages: messages,
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

        // compare it using bcrypt and if successful..
        if (await bcrypt.compare(password, hashedPassword)) {
          // set the username for the session.
          req.session.username = username;
          // redirect user to index page.
          res.redirect("/");
        } else {
          // password is incorrect, render login again with error message.
          res.render("login", {
            layout: "hideLayout.hbs",
            message: "Invalid username/password combination!",
          });
        }
      }
    });
  });
});

module.exports = router;
