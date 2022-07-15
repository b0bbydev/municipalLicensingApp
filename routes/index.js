var express = require("express");
var router = express.Router();
// authHelper middleware.
const { auth, isLoggedIn } = require("../config/authHelpers");

/* GET home page. */
router.get("/", function (req, res, next) {
  // check if there's an error message in the session
  let messages = req.session.messages || [];
  // clear session messages
  req.session.messages = [];
  // delete session lastEnteredDropdownTitle.
  delete req.session.lastEnteredDropdownTitle;

  return res.render("index", {
    title: "BWG | Home",
    errorMessages: messages,
    email: req.session.email,
    auth: req.session.auth, // authorization.
    baseUrl: req.baseUrl, // back button logic.
    indexUrl: "/", // back button logic.
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
