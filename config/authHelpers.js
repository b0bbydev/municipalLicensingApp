/* this file will contain the middleware to ensure the user is logged in, by checking for a username. */

module.exports = {
  // this method will redirect the user back to login page, if the session doesn't contain a username.
  redirectToLogin: function (req, res, next) {
    if (!req.session.username) {
      res.redirect("/login");
    } else {
      next();
    } // end of if-else.
  }, // end of redirectToLogin().
};
