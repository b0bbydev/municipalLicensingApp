var express = require("express");
const app = require("../app");
var router = express.Router();
var db = require("../config/dbconfig");

// include auth functions.
const { adminUser, isLoggedIn } = require("../config/sessionConfig");

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

// Logout.
router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/login');
});

module.exports = router;
