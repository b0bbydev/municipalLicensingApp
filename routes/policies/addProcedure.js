var express = require("express");
var router = express.Router();
// models.
const Dropdown = require("../../models/dropdownManager/dropdown");
// authHelper middleware.
const {
  dogLicenseAuth,
  adminAuth,
  isLoggedIn,
} = require("../../config/authHelpers");
// request limiter.
const limiter = require("../../config/limiter");

/* GET home page. */
router.get("/", async (req, res, next) => {
  // check if there's an error message in the session
  let messages = req.session.messages || [];
  // clear session messages
  req.session.messages = [];

  // dropdown values.
  // status options.
  var statusDropdownValues = await Dropdown.findAll({
    where: {
      dropdownFormID: 12,
      dropdownTitle: "Status Options",
    },
  });

  return res.render("policies/addProcedure", {
    title: "BWG | Add Procedure",
    errorMessages: messages,
    email: req.session.email,
    dogAuth: req.session.dogAuth, // authorization.
    admin: req.session.admin, // authorization.
    statusDropdownValues: statusDropdownValues,
  });
});

module.exports = router;
