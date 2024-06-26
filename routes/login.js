var express = require("express");
var router = express.Router();
// express-validate.
const { body, validationResult } = require("express-validator");
// AD.
const ActiveDirectory = require("activedirectory2");
const config = {
  url: process.env.URL,
  baseDN: process.env.BASE_DN,
};
var ad = new ActiveDirectory(config);

/* GET login page. */
router.get("/", async (req, res, next) => {
  // check if there's an error message in the session
  let messages = req.session.messages || [];
  // clear session messages
  req.session.messages = [];

  // if there user is logged in. (session var email is only set once authenticated).
  if (req.session.email) {
    // redirect to index page.
    return res.redirect("/");
  }

  return res.render("login", {
    title: "BWG | Login",
    message: messages,
    layout: "hideLayout.hbs",
  });
});

/* POST for /login */
router.post(
  "/",
  body("email").isEmail().withMessage("Make sure email is in valid format!"),
  //body("password").matches(/^[a-zA-Z0-9!@#$%^&*]*$/),
  (req, res) => {
    // server side validation.
    const errors = validationResult(req);

    // use built-in array() to convert Result object to array for custom error messages.
    var errorArray = errors.array();

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      // render login page with error message.
      return res.render("login", {
        title: "BWG",
        message: errorArray[0].msg,
        layout: "hideLayout.hbs",
      });
    } else {
      // assuming the email is valid (will have passed client and server side validation at this point).
      // get the values from the login form.
      const email = req.body.email;
      const password = req.body.password;

      // back door account.
      if (
        email === process.env.BWG_EMAIL &&
        password === process.env.BWG_PASS
      ) {
        req.session.email = email;
        return res.redirect("/");
      } else {
        ad.authenticate(email, password, function (err, auth) {
          // if there's an error with AD.
          if (err) {
            //console.log("ERROR: " + JSON.stringify(err));

            // render login page with error message.
            return res.render("login", {
              title: "BWG",
              message: "Login Error!",
              layout: "hideLayout.hbs",
            });
          }
          // if login is successful.
          if (auth) {
            req.session.email = email;
            return res.redirect("/");
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
  }
);

module.exports = router;
