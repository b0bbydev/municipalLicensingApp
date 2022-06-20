var express = require("express");
var router = express.Router();
// authHelper middleware.
const {
  dogLicenseAuth,
  adminAuth,
  isLoggedIn,
} = require("../config/authHelpers");
// express-rate-limit.
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: "Too many requests! Slow down!",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/* GET home page. */
router.get(
  "/",
  limiter,
  adminAuth,
  dogLicenseAuth,
  isLoggedIn,
  function (req, res, next) {
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
      dogAuth: req.session.dogAuth, // authorization.
      admin: req.session.admin, // authorization.
      baseUrl: req.baseUrl, // back button logic.
      indexUrl: "/", // back button logic.
    });
  }
);

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
