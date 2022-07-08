module.exports = {
  // this method will redirect the user back to login page, if the session doesn't contain an email.
  isLoggedIn: function (req, res, next) {
    if (!req.session.email) {
      res.redirect("/login");
    } else {
      next();
    } // end of if-else.
  }, // end of isLoggedIn().

  adminAuth: function (req, res, next) {
    const emails = ["bjonkman@townofbwg.com", "charbour@townofbwg.com"];

    // if the session email is in "whitelist", set session 'admin' == true.
    if (emails.includes(req.session.email.toLowerCase())) {
      req.session.admin = true;
      next();
    } else {
      // if not auth'd, don't create session variable, just forward them to next middleware.
      next();
    }
  },

  dogLicenseAuth: function (req, res, next) {
    const emails = [
      "echisholm@townofbwg.com",
      "momarques@townofbwg.com",
      "blee@townofbwg.com",
      "treynolds@townofbwg.com",
      "lfortune@townofbwg.com",
      "rmurphy@townofbwg.com",
      "ipogacevski@townofbwg.com",
    ];

    // if the session email is in "whitelist", set session 'auth' == true.
    if (emails.includes(req.session.email.toLowerCase())) {
      req.session.dogAuth = true;
      next();
    } else {
      next();
    }
  },

  policiesAuth: function (req, res, next) {
    const emails = ["jkinsella@townofbwg.com"];

    // if the session email is in "whitelist", set session 'auth' == true.
    if (emails.includes(req.session.email.toLowerCase())) {
      req.session.policyAuth = true;
      next();
    } else {
      next();
    }
  },
};
