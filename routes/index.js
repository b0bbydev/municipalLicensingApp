var express = require("express");
var router = express.Router();
const passport = require("passport");
// config files.
var db = require("../config/dbconfig");
const { genPassword, userExists } = require("../config/sessionConfig");

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

// POST for register.
router.post("/register", [userExists], (req, res, next) => {
  const saltHash = genPassword(req.body.password);
  const salt = saltHash.salt;
  const hash = saltHash.hash;

  var query =
    "INSERT INTO users (username, hash, salt, isAdmin) values (?, ?, ?, 0)";

  db.query(
    query,
    [req.body.username, hash, salt],
    function (err, results, fields) {
      if (err) {
        console.log(err);
      } else {
        console.log("User Registered!");
      } // end of if-else.
      res.redirect("/login");
    }
  );
});

// POST for login.
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureMessage: "Invalid Login",
  })
);

// Logout.
router.get("/logout", (req, res, next) => {
  req.logout();
  res.redirect("/login");
});

module.exports = router;
