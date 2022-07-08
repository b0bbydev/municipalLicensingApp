// models.
var User = require("../models/admin/user");

module.exports = {
  // this method will redirect the user back to login page, if the session doesn't contain an email.
  isLoggedIn: function (req, res, next) {
    if (!req.session.email) {
      res.redirect("/login");
    } else {
      next();
    } // end of if-else.
  }, // end of isLoggedIn().

  // create a method to decide authLevel based on session email and what is in user table.
  auth: async (req, res, next) => {
    // get authLevel for user.
    let authLevel = await User.findOne({
      attributes: ["authLevel"],
      where: {
        email: req.session.email,
      },
    });

    // if authLevel exits - set it in session; if not forward to next middleware.
    if (authLevel) {
      req.session.auth = authLevel;
      next();
    } else {
      next();
    }
  },
};
