var express = require("express");
var router = express.Router();
const { redirectToLogin } = require("../config/authHelpers");
// dbHelpers.
var dbHelpers = require("../config/dbHelpers");
// express-validate.
const { body, validationResult } = require("express-validator");

/* GET dropdown page. */
router.get("/", async (req, res, next) => {
  // check if there's an error message in the session
  let messages = req.session.messages || [];

  // clear session messages
  req.session.messages = [];

  var data = await dbHelpers.getAllFromDropdown();

  return res.render("dropdown", {
    title: "BWG | Dropdown",
    errorMessages: messages,
    email: req.session.email,
    data: data,
  });
});

/* POST dropdown value */
router.post(
  "/",
  body("value")
    .matches(/^[^'";=_()*&%$#!<>\/\^\\]*$/)
    .trim(),
  function (req, res, next) {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      // render dropdown page with error message.
      return res.render("dropdown", {
        title: "BWG | Dropdown",
        message: "Invalid entry!",
      });
    } else {
      // insert into db.
      dbHelpers.insertToDropdown(req.body.value);

      // redirect to /dropdown if successful. (reload page)
      res.redirect("/dropdown");
    }
  }
);

module.exports = router;
