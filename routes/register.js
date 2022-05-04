var express = require("express");
var router = express.Router();
const mysql = require("mysql");
// bcrypt for password encryption.
const bcrypt = require("bcrypt");
// config files.
const db = require("../config/db");
// express-validate.
const { body, validationResult } = require("express-validator");

/* GET register page. */
router.get("/", function (req, res, next) {
  // check if there's an error message in the session
  let messages = req.session.messages || [];

  // clear session messages
  req.session.messages = [];

  res.render("register", {
    title: "BWG | Register",
    errorMessages: messages,
    // include hideLayout (just bootstrap/css) to hide nav on login view.
    layout: "hideLayout.hbs",
  });
});

/* POST for /register */ /* note the middleware from express-validate. */
router.post(
  "/",
  body("email").isEmail().normalizeEmail(),
  // "Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character. e.g: Testpass1!"
  body("password").matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  ),
  async (req, res) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      // render login page with error message.
      res.render("register", {
        title: "BWG",
        message: "Invalid email or password!",
        layout: "hideLayout.hbs",
      });
      // assuming the email is valid (will have passed client and server side validation at this point).
    } else {
      // get values from req.body - these are passed into the request from the form.
      const email = req.body.email;
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      // connect to db.
      db.getConnection(async (err, connection) => {
        // do something on error.
        if (err) {
          console.log(err);
        }

        // the reason for breaking the sql queries down into 2 parts (each), is to add some extra security (prepared statement -> mysql.format).
        const sqlSearch = "SELECT * FROM users WHERE email = ?";
        const search_query = mysql.format(sqlSearch, [email]);

        const sqlInsert = "INSERT INTO users (isAdmin, email, password) VALUES (?, ?, ?)";
        const insert_query = mysql.format(sqlInsert, [0, email, hashedPassword]); // set isAdmin to 0 (false) by default.

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
            res.render("register", {
              layout: "hideLayout.hbs",
              message: "User already exists",
            });
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
    }
  }
);

module.exports = router;
