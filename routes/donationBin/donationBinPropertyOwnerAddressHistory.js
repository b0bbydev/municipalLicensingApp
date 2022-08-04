var express = require("express");
var router = express.Router();
// models.
const Dropdown = require("../../models/dropdownManager/dropdown");
const DonationBinPropertyOwnerAddressHistory = require("../../models/donationBin/donationBinPropertyOwnerAddressHistory");
// express-validate.
const { body, validationResult } = require("express-validator");

/* GET /donationBin/donationBinPropertyOwnerAddressHistory/:id */
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
      return res.render("donationBin/donationBinPropertyOwnerAddressHistory", {
        title: "BWG | Donation Bin Property Owner Address History",
        message: "Page Error!",
        auth: req.session.auth, // authorization.
      });
    } else {
      // check if there's an error message in the session
      let messages = req.session.messages || [];
      // clear session messages
      req.session.messages = [];

      DonationBinPropertyOwnerAddressHistory.findAndCountAll({
        where: {
          donationBinPropertyOwnerID: req.params.id,
        },
        order: [["donationBinPropertyOwnerAddressHistoryID", "DESC"]],
      }).then((results) => {
        return res.render(
          "donationBin/donationBinPropertyOwnerAddressHistory",
          {
            title: "BWG | Donation Bin Property Owner Address History",
            errorMessages: messages,
            email: req.session.email,
            auth: req.session.auth, // authorization.
            monthDropdownValues: monthDropdownValues,
            yearDropdownValues: yearDropdownValues,
            data: results.rows,
            donationBinPropertyOwnerID: req.params.id,
          }
        );
      });
    }
  }
);

module.exports = router;
