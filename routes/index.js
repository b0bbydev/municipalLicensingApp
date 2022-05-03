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
    username: req.session.username,
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
