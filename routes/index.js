var express = require("express");
var router = express.Router();
// authHelper middleware.
const { redirectToLogin } = require("../config/authHelpers");

/* GET home page. */
router.get("/", function (req, res, next) {
  return res.render("index", {
    title: "BWG | Home",
    email: req.session.email,
  });
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
