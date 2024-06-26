var express = require("express");
var router = express.Router();
// models.
const User = require("../../models/admin/user");
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
    message: messages,
    email: req.session.email,
    auth: req.session.auth, // authorization.
  });
});

/* POST /admin/addUser */
router.post(
  "/",
  body("firstName")
    .if(body("firstName").notEmpty())
    .matches(/^[^%<>^$\\;!{}?]+$/)
    .withMessage("Invalid First Name Entry!")
    .trim(),
  body("lastName")
    .if(body("lastName").notEmpty())
    .matches(/^[^%<>^$\\;!{}?]+$/)
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

    // use built-in array() to convert Result object to array for custom error messages.
    var errorArray = errors.array();

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("admin/addUser", {
        title: "BWG | Add User",
        message: errorArray[0].msg, // custom error message. (should indicate which field has the error.)
        email: req.session.email,
        auth: req.session.auth, // authorization.
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
        .then(() => {
          return res.redirect("/admin");
        })
        .catch((err) => {
          return res.render("admin/addUser", {
            title: "BWG | Add User",
            message: "Page Error!",
            auth: req.session.auth, // authorization.
          });
        });
    }
  }
);

module.exports = router;
