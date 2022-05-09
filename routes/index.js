var express = require("express");
var router = express.Router();
// config files.
const db = require("../config/db");
// authHelper middleware.
const { redirectToLogin } = require("../config/authHelpers");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", {
    title: "BWG | Home",
    email: req.session.email,
    isAdmin: req.session.isAdmin,
  });
});

/* DELETE dropdown value */
router.get("/dropdown/delete/:id", (req, res, next) => {
  // validate to make sure only a number can be passed here.
  if (!req.params.id.match(/^\d+$/)) {
    // if something other than a number is passed, redirect again to dropdown.
    res.redirect("/dropdown");
  } else {
    // save dropdownID.
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
  }
});

/* DISABLE dropdown value */
router.get("/dropdown/disable/:id", (req, res, next) => {
  // validate to make sure only a number can be passed here.
  if (!req.params.id.match(/^\d+$/)) {
    // if something other than a number is passed, redirect again to dropdown.
    res.redirect("/dropdown");
  } else {
    // save dropdownID.
    var dropdownID = req.params.id;

    // create the query.
    var query = "UPDATE dropdown SET isDisabled = 1 WHERE dropdownID = ?";

    // call query on db.
    db.query(query, [dropdownID], function (err, data) {
      if (err) {
        console.log(err);
      }
    });

    // redirect to home after success.
    res.redirect("/dropdown");
  }
});

/* GET logout page */
router.get("/logout", function (req, res, next) {
  // destory the session.
  req.session.destroy();
  // clear cookies for session.
  res.clearCookie(process.env.SESSION_NAME);
  // redirect back to login.
  res.redirect("/login");
});

module.exports = router;
