module.exports = {
  // this method will redirect the user back to login page, if the session doesn't contain a username.
  redirectToLogin: function (req, res, next) {
    if (!req.session.email) {
      res.redirect("/login");
    } else {
      next();
    } // end of if-else.
  }, // end of redirectToLogin().
};
