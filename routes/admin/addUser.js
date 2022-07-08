var express = require("express");
var router = express.Router();
// models.
const User = require("../../models/admin/user");
// authHelper middleware.
const { isLoggedIn, auth, isAdmin } = require("../../config/authHelpers");
// express-validate.
const { body, validationResult } = require("express-validator");

/* GET admin/addUser page. */
router.get("/", async (req, res, next) => {
  // check if there's an error message in the session
  let messages = req.session.messages || [];
  // clear session messages
  req.session.messages = [];

  return res.render("admin/addUser", {
    title: "BWG | Admin Panel",
    errorMessages: messages,
    email: req.session.email,
    auth: req.session.auth.authLevel, // authorization.
  });
});

/* POST /addOwner */
router.post(
  "/",
  body("firstName")
    .if(body("firstName").notEmpty())
    .matches(/^[a-zA-Z\'-]*$/)
    .withMessage("Invalid First Name Entry!")
    .trim(),
  body("lastName")
    .if(body("lastName").notEmpty())
    .matches(/^[a-zA-Z\'-]*$/)
    .withMessage("Invalid Last Name Entry!")
    .trim(),
  body("email")
    .if(body("email").notEmpty())
    .isEmail()
    .withMessage("Invalid Email Entry!")
    .trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("dogtags/addOwner", {
        title: "BWG | Owner",
        message: errorArray[0].msg, // custom error message. (should indicate which field has the error.)
        email: req.session.email,
        auth: req.session.auth.authLevel, // authorization.
        // if the form submission is unsuccessful, save their values.
        formData: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
        },
      });
    } else {
      User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
      })
        .then(res.redirect("/admin"))
        .catch((err) => {
          return res.render("admin", {
            title: "BWG | Admin Panel",
            message: "Page Error!",
          });
        });
    }
  }
);

module.exports = router;
