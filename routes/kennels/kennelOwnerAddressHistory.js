var express = require("express");
var router = express.Router();
// models.
const Dropdown = require("../../models/dropdownManager/dropdown");
const KennelOwnerAddressHistory = require("../../models/kennel/kennelOwnerAddressHistory");
// express-validate.
const { body, validationResult } = require("express-validator");

/* GET /kennels/kennelOwnerAddressHistory/:id */
router.get(
  "/:id",
  body("filterCategory")
    .matches(/^[^'";=_()*&%$#!<>\/\^\\]*$/)
    .trim(),
  body("filterValue")
    .matches(/^[^'";=_()*&%$#!<>\/\^\\]*$/)
    .trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // get month dropdown values.
    var monthDropdownValues = await Dropdown.findAll({
      where: {
        dropdownFormID: 29, // filtering options.
        dropdownTitle: "Policy History Filtering Options - Months",
      },
    });
    // get year dropdown values.
    var yearDropdownValues = await Dropdown.findAll({
      where: {
        dropdownFormID: 29, // filtering options.
        dropdownTitle: "Policy History Filtering Options - Years",
      },
    });

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("kennels/kennelOwnerAddressHistory", {
        title: "BWG | Kennel Owner Address History",
        message: "Page Error!",
        auth: req.session.auth, // authorization.
      });
    } else {
      // check if there's an error message in the session
      let messages = req.session.messages || [];
      // clear session messages
      req.session.messages = [];

      KennelOwnerAddressHistory.findAndCountAll({
        where: {
          kennelOwnerID: req.params.id,
        },
        order: [["kennelOwnerAddressHistoryID", "DESC"]],
      }).then((results) => {
        return res.render("kennels/kennelOwnerAddressHistory", {
          title: "BWG | Kennel Owner Address History",
          errorMessages: messages,
          email: req.session.email,
          auth: req.session.auth, // authorization.
          monthDropdownValues: monthDropdownValues,
          yearDropdownValues: yearDropdownValues,
          data: results.rows,
          kennelOwnerID: req.params.id,
        });
      });
    }
  }
);

module.exports = router;
