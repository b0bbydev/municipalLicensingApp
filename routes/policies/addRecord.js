var express = require("express");
var router = express.Router();
// models.
const Dropdown = require("../../models/dropdownManager/dropdown");
// express-validate.
const { body, validationResult } = require("express-validator");

/* GET /addRecord */
router.get("/", async (req, res, next) => {
  // server side validation.
  const errors = validationResult(req);

  // if errors is NOT empty (if there are errors...).
  if (!errors.isEmpty()) {
    return res.render("policies/addRecord", {
      title: "BWG | Add Record",
      message: "Page Error!",
      auth: req.session.auth, // authorization.
    });
  } else {
    // check if there's an error message in the session.
    let messages = req.session.messages || [];
    // clear session messages.
    req.session.messages = [];

    // dropdown values.
    // status options.
    var statusDropdownValues = await Dropdown.findAll({
      where: {
        dropdownFormID: 12,
        dropdownTitle: "Status Options",
      },
    });
    // category options.
    var categoryDropdownValues = await Dropdown.findAll({
      where: {
        dropdownFormID: 12,
        dropdownTitle: "Category Options",
      },
    });
    // authority options.
    var authorityDropdownValues = await Dropdown.findAll({
      where: {
        dropdownFormID: 12,
        dropdownTitle: "Authority Options",
      },
    });

    return res.render("policies/addRecord", {
      title: "BWG | Add Record",
      errorMessages: messages,
      email: req.session.email,
      auth: req.session.auth, // authorization.
      statusDropdownValues: statusDropdownValues,
      categoryDropdownValues: categoryDropdownValues,
      authorityDropdownValues: authorityDropdownValues,
    });
  }
});

module.exports = router;
