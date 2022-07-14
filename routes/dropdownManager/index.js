var express = require("express");
var router = express.Router();
// models.
const DropdownForm = require("../../models/dropdownManager/dropdownForm");
// sequelize.
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
// express-validate.
const { body, validationResult } = require("express-validator");

/* GET /dropdownManager */
router.get("/", async (req, res, next) => {
  // check if there's an error message in the session
  let messages = req.session.messages || [];
  // clear session messages
  req.session.messages = [];

  DropdownForm.findAndCountAll({
    limit: req.query.limit,
    offset: req.skip,
  })
    .then((results) => {
      return res.render("dropdownManager", {
        title: "BWG | Dropdown Manager",
        errorMessages: messages,
        email: req.session.email,
        auth: req.session.auth, // authorization.
        data: results.rows,
      });
    })
    .catch((err) => {
      return res.render("dropdownManager", {
        title: "BWG | Dropdown Manager",
        message: "Page Error!",
      });
    });
});

/* POST /dropdownManger */
router.post(
  "/",
  body("formName")
    .notEmpty()
    .matches(/^[a-zA-Z0-9\/\- ]*$/)
    .withMessage("Invalid Form/Dropdown Name Entry!")
    .trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("dropdownManager", {
        title: "BWG | Dropdown Manager",
        message: "Error!",
        email: req.session.email,
        auth: req.session.auth, // authorization.
      });
    } else {
      // create dropdown form.
      DropdownForm.create({
        formName: req.body.formName,
      })
        .then(res.redirect("/dropdownManager"))
        .catch((err) => {
          return res.render("dropdownManager", {
            title: "BWG | Dropdown Manager",
            message: "Page Error!",
          });
        });
    }
  }
);

module.exports = router;
