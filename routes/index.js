var express = require("express");
var router = express.Router();
// bcrypt for password encryption.
const bcrypt = require("bcrypt");
// config files.
var db = require("../config/dbconfig");
const mysql = require("mysql");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "BWG" });
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

    const sqlSearch = "SELECT * FROM users WHERE username = ?";
    const search_query = mysql.format(sqlSearch, [username]);

    const sqlInsert = "INSERT INTO users (username, password) VALUES (?, ?)";
    const insert_query = mysql.format(sqlInsert, [username, hashedPassword]);

    await connection.query(search_query, async (err, result) => {
      if (err) {
        console.log(err);
      }

      // if user already exists.
      if (result.length != 0) {
        connection.release();
        res.redirect("/login");
      } else {
        await connection.query(insert_query, (err, result) => {
          if (err) {
            console.log(err);
          }
          connection.release();
          res.redirect("/");
        });
      }
    });
  });
});

module.exports = router;
