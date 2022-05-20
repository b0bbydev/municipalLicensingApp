var express = require("express");
var router = express.Router();
// express-validate.
const { body, validationResult } = require("express-validator");
// AD.
var ActiveDirectory = require("activedirectory");
var config = {
  url: process.env.URL,
};
var ad = new ActiveDirectory(config);

/* GET login page. */
router.get("/", function (req, res, next) {
  // check if there's an error message in the session
  let messages = req.session.messages || [];

  // clear session messages
  req.session.messages = [];

  res.render("login", {
    title: "BWG | Login",
    errorMessages: messages,
    layout: "hideLayout.hbs",
  });
});

/* POST for /login */
router.post(
  "/",
  body("email").isEmail().normalizeEmail().trim(),
  body("password")
    // Minimum 12 characters; at least one uppercase letter, one lowercase letter, one special character
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/)
    .trim(),
  (req, res) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      // render login page with error message.
      return res.render("login", {
        title: "BWG",
        message: "Invalid email and/or password!",
        layout: "hideLayout.hbs",
      });
    } else {
      // assuming the email is valid (will have passed client and server side validation at this point).
      // get the values from the login form.
      const email = req.body.email;
      const password = req.body.password;

      ad.authenticate(email, password, function (err, auth) {
        // if there's an error with AD.
        if (err) {
          console.log("ERROR: " + JSON.stringify(err));

          // render login page with error message.
          return res.render("login", {
            title: "BWG",
            message: "Login Error!",
            layout: "hideLayout.hbs",
          });
        }
        // if login is successful.
        if (auth) {
          // set the email for the session.
          req.session.email = email;
          res.redirect("/");
        } else {
          // render login page with error message.
          return res.render("login", {
            title: "BWG",
            message: "Login Error!",
            layout: "hideLayout.hbs",
          });
        }
      });
    }
  }
);

module.exports = router;
