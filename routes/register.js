var express = require("express");
var router = express.Router();
const mysql = require("mysql");
// bcrypt for password encryption.
const bcrypt = require("bcrypt");
// config files.
const db = require("../config/db");

/* GET register page. */
router.get("/", function (req, res, next) {
  res.render("register", {
    title: "BWG",
    // include hideLayout (just bootstrap/css) to hide nav on login view.
    layout: "hideLayout.hbs",
  });
});

/* POST for /register */
router.post("/", async (req, res) => {
  // get values from req.body - these are passed into the request from the form.
  const username = req.body.username;
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  // connect to db.
  db.getConnection(async (err, connection) => {
    if (err) {
      console.log(err);
    }

    // the reason for breaking the sql queries down into 2 parts (each), is to add some extra security (prepared statement -> mysql.format).
    const sqlSearch = "SELECT * FROM users WHERE username = ?";
    const search_query = mysql.format(sqlSearch, [username]);

    const sqlInsert = "INSERT INTO users (username, password) VALUES (?, ?)";
    const insert_query = mysql.format(sqlInsert, [username, hashedPassword]);

    // attempt the search query - check if user already exists.
    await connection.query(search_query, async (err, results) => {
      if (err) {
        console.log(err);
      }

      // if user already exists.
      if (results.length != 0) {
        // close the connection.
        connection.release();

        // redirect to login page again.
        res.redirect("/login");
        // res.render("register", {
        //   message: "User already exists",
        // });
      } else {
        // request should be good by here, execute insert query.
        await connection.query(insert_query, (err, results) => {
          if (err) {
            console.log(err);
          }
          // closes the connection to the db.
          connection.release();

          // redirect to login page if successful.
          res.redirect("/login");
        });
      }
    });
  });
});

module.exports = router;
