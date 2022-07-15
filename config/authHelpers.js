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
    User.findOne({
      include: [
        {
          model: Role,
          attributes: ["roleName"],
          through: {},
        },
      ],
      where: {
        email: req.session.email,
      },
    }).then((results) => {
      let roles = results.roles;
      let roleNames = [];

      // loop through roleNames and add to array.
      for (i = 0; i < roles.length; i++) {
        roleNames.push(roles[i].roleName);
      }

      // send to session as String.
      req.session.auth = roleNames.toString();
      next();
    });
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
