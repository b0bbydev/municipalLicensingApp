var express = require("express");
var router = express.Router();
const Dropdown = require("../../models/dropdownManager/dropdown");

/* GET /adultEntertainment/addBusiness page. */
router.get("/", async (req, res, next) => {
  // check if there's an error message in the session
  let messages = req.session.messages || [];
  // clear session messages
  req.session.messages = [];

  // get dropdown values.
  var dropdownValues = await Dropdown.findAll({
    where: {
      dropdownFormID: 13, // streets
    },
  });

  return res.render("adultEntertainment/addBusiness", {
    title: "BWG | Add Business",
    errorMessages: messages,
    email: req.session.email,
    auth: req.session.auth, // authorization.
    dropdownValues: dropdownValues,
  });
});

module.exports = router;
