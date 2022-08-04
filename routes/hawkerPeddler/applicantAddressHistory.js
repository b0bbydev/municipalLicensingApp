var express = require("express");
var router = express.Router();
// models.
const Dropdown = require("../../models/dropdownManager/dropdown");
const HawkerPeddlerApplicantAddressHistory = require("../../models/hawkerPeddler/hawkerPeddlerApplicantAddressHistory");
// express-validate.
const { body, validationResult } = require("express-validator");

/* GET /hawkerPeddler/applicantAddressHistory/:id */
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
      return res.render("hawkerPeddler/applicantAddressHistory", {
        title: "BWG | Applicant Address History",
        message: "Page Error!",
        auth: req.session.auth, // authorization.
      });
    } else {
      // check if there's an error message in the session
      let messages = req.session.messages || [];
      // clear session messages
      req.session.messages = [];

      HawkerPeddlerApplicantAddressHistory.findAndCountAll({
        where: {
          hawkerPeddlerApplicantID: req.params.id,
        },
        order: [["hawkerPeddlerApplicantAddressHistoryID", "DESC"]],
      }).then((results) => {
        return res.render("hawkerPeddler/applicantAddressHistory", {
          title: "BWG | Applicant Address History",
          errorMessages: messages,
          email: req.session.email,
          auth: req.session.auth, // authorization.
          monthDropdownValues: monthDropdownValues,
          yearDropdownValues: yearDropdownValues,
          data: results.rows,
          hawkerPeddlerApplicantID: req.params.id,
        });
      });
    }
  }
);

module.exports = router;