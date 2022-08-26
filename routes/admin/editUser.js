var express = require("express");
var router = express.Router();
// models.
const User = require("../../models/admin/user");
// express-validate.
const { body, param, validationResult } = require("express-validator");

/* GET /admin/editUser page. */
router.get(
  "/:id",
  param("id").matches(/^\d+$/).trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...).
    if (!errors.isEmpty()) {
      return res.render("admin/editUser", {
        title: "BWG | Admin Panel",
        message: "Page Error!",
        email: req.session.email,
        auth: req.session.auth, // authorization.
      });
    } else {
      // check if there's an error message in the session
      let messages = req.session.messages || [];
      // clear session messages
      req.session.messages = [];

      // used to populate edit form fields.
      User.findOne({
        where: {
          id: req.params.id,
        },
      })
        .then((results) => {
          return res.render("admin/editUser", {
            title: "BWG | Edit User",
            message: messages,
            email: req.session.email,
            auth: req.session.auth, // authorization.
            // populate input fields with existing values.
            formData: {
              firstName: results.firstName,
              lastName: results.lastName,
              email: results.email,
            },
          });
        })
        .catch((err) => {
          return res.render("admin/editUser", {
            title: "BWG | Edit User",
            message: "Page Error!",
            auth: req.session.auth, // authorization.
          });
        });
    }
  }
);

/* POST /admin/editUser */
router.post(
  "/:id",
  param("id").matches(/^\d+$/).trim(),
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
      return res.render("admin/editUser", {
        title: "BWG | Edit User",
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
      User.update(
        {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      )
        .then(() => {
          return res.redirect("/admin");
        })
        .catch((err) => {
          return res.render("admin/editUser", {
            title: "BWG | Edit User",
            message: "Page Error!",
            auth: req.session.auth, // authorization.
          });
        });
    }
  }
);

module.exports = router;
