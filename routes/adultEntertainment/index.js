var express = require("express");
var router = express.Router();
// models.
const Dropdown = require("../../models/dropdownManager/dropdown");
// authHelper middleware.
const { auth, isLoggedIn } = require("../../config/authHelpers");

/* GET /adultEntertainment page. */
router.get("/", isLoggedIn, auth, async (req, res, next) => {
  // check if there's an error message in the session
  let messages = req.session.messages || [];
  // clear session messages
  req.session.messages = [];

  // get dropdown values.
  var dropdownValues = await Dropdown.findAll({
    where: {
      dropdownFormID: 15,
    },
  });

  return res.render("adultEntertainment/index", {
    title: "BWG | Home",
    errorMessages: messages,
    email: req.session.email,
    auth: req.session.auth, // authorization.
    dropdownValues: dropdownValues,
  });
});

module.exports = router;
