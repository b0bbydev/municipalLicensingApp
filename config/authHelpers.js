// models.
var User = require("../models/admin/user");
var Role = require("../models/admin/role");

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
    let authLevels = await User.findAll({
      $attributes$: ["roleName"],
      where: {
        email: req.session.email,
      },
      include: [
        {
          model: Role,
        },
      ],
    });

    // create roles array.
    var roles = [];
    // loop through authLevels result, and add to roles[] array.
    for (i = 0; i < authLevels[0].roles.length; i++) {
      roles.push(authLevels[0].roles[i].roleName);
    }

    // if roles array contains at least 1 record.
    if (roles.length > 0) {
      // populate session var 'auth' with values users' roles.
      req.session.auth = roles;
      next();
    } else {
      next();
    }
  }, // end of auth().

  /* create page specific middleware which will redirect the user to home page. */
  // force admin auth.
  isAdmin: function (req, res, next) {
    if (req.session.auth.includes("Admin")) {
      next();
    } else {
      res.redirect("/");
    }
  }, // end of isAdmin().

  // force dog license auth.
  isDogLicense: function (req, res, next) {
    if (req.session.auth.includes("Dog Licenses")) {
      next();
    } else {
      res.redirect("/");
    }
  },

  // force policies auth.
  isPolicy: function (req, res, next) {
    if (req.session.auth.includes("Policies")) {
      next();
    } else {
      res.redirect("/");
    }
  },
};
