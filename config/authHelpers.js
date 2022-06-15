// express-rate-limit.
const rateLimit = require("express-rate-limit");

module.exports = {
  // this method will redirect the user back to login page, if the session doesn't contain a username.
  redirectToLogin: function (req, res, next) {
    if (!req.session.email) {
      res.redirect("/login");
    } else {
      next();
    } // end of if-else.
  }, // end of redirectToLogin().

  limiter: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    message: "Too many requests! Slow down!",
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  }),
};
