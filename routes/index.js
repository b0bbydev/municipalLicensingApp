var express = require("express");
var router = express.Router();
// bcrypt for password encryption.
const bcrypt = require("bcrypt");
// config files.
var db = require("../config/dbconfig");
const mysql = require("mysql");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", {
    title: "BWG",
    user: req.session.username,
  });
});

/* honestly not sure why this needs to be included in this route, rather than dropdown.js */
/* DELETE dropdown value */
router.get("/dropdown/delete/:id", (req, res, next) => {
  /* *NEED TO VALIDATE THIS* */
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
  res.redirect("/dropdown");
});

/* POST for register */
router.post("/register", async (req, res) => {
  // get values from req.body - these are passed into req from the form.
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

    // attempt the search query.
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
      } else {
        // assume the request was good, insert the query.
        await connection.query(insert_query, (err, results) => {
          if (err) {
            console.log(err);
          }
          // closes the connection to the db.
          connection.release();

          // redirect to index page if successful.
          res.redirect("/");
        });
      }
    });
  });
});

/* POST for login */
router.post("/login", (req, res) => {
  // get the values from the login form.
  const user = req.body.username;
  const password = req.body.password;

  // create the connection the db.
  db.getConnection(async (err, connection) => {
    if (err) {
      console.log(err);
    }

    // create the SQL query, and format.
    const sqlSearch = "SELECT * FROM users WHERE username = ?";
    const search_query = mysql.format(sqlSearch, [user]);

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
          req.session.username = user;
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
