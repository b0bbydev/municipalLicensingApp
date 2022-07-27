var express = require("express");
var router = express.Router();
// models.
const Dropdown = require("../../models/dropdownManager/dropdown");
// sequelize.
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
// helper.
const funcHelpers = require("../../config/funcHelpers");
// express-validate.
const { body, validationResult } = require("express-validator");
// pagination lib.
const paginate = require("express-paginate");

/* GET /adultEntertainment page. */
router.get(
  "/",
  body("filterCategory")
    .matches(/^[^'";=_()*&%$#!<>\/\^\\]*$/)
    .trim(),
  body("filterValue")
    .matches(/^[^'";=_()*&%$#!<>\/\^\\]*$/)
    .trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("liquor/index", {
        title: "BWG | Liquor Licensing",
        message: "Page Error!",
        auth: req.session.auth, // authorization.
      });
    } else {
      // check if there's an error message in the session
      let messages = req.session.messages || [];
      // clear session messages
      req.session.messages = [];

      // get dropdown values.
      var dropdownValues = await Dropdown.findAll({
        where: {
          dropdownFormID: 15, // adult entertainment filtering options.
        },
      });

      // if there are no filter parameters.
      if (!req.query.filterCategory || !req.query.filterValue) {
        return res.render("liquor/index", {
          title: "BWG | Liquor Licensing",
          errorMessages: messages,
          email: req.session.email,
          auth: req.session.auth, // authorization.
        });
      }
    }
  }
);

module.exports = router;
