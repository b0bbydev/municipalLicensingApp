var express = require("express");
var router = express.Router();
const { redirectToLogin } = require("../../config/authHelpers");
// dbHelpers.
var dbHelpers = require("../../config/dbHelpers");
// express-validate.
const { param, validationResult } = require("express-validator");

/* GET dropdown page. */
router.get("/", async (req, res, next) => {
  // check if there's an error message in the session
  let messages = req.session.messages || [];

  // clear session messages
  req.session.messages = [];

  var data = await dbHelpers.getAllForms();

  return res.render("dropdownManager/index", {
    title: "BWG | Dropdown Manager",
    errorMessages: messages,
    email: req.session.email,
    data: data,
  });
});

router.get(
  "/form/:id",
  param("id").matches(/^\d+$/).trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("dropdownManager", {
        title: "BWG | Dropdown Manager",
        message: "Error!",
        email: req.session.email,
      });
    } else {
      // check if there's an error message in the session
      let messages = req.session.messages || [];

      // clear session messages
      req.session.messages = [];

      // store formID in session to use in other endpoints.
      req.session.formID = req.params.id;

      var data = await dbHelpers.getAllFromDropdown(req.session.formID);
      var formName = await dbHelpers.getFormNameFromFormID(req.session.formID);

      return res.render("dropdownManager/form", {
        title: "BWG | Add Dog",
        errorMessages: messages,
        email: req.session.email,
        formName: formName[0].formName,
        data: data,
      });
    }
  }
);

module.exports = router;
