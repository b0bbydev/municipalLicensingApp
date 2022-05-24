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

      var data = await dbHelpers.getAllFromDropdown(req.params.id);

      return res.render("dropdownManager/form", {
        title: "BWG | Add Dog",
        errorMessages: messages,
        email: req.session.email,
        data: data,
      });
    }
  }
);

/* DISABLE dropdown value */
router.get("/dropdown/disable/:id", (req, res, next) => {
  // validate to make sure only a number can be passed here.
  if (!req.params.id.match(/^\d+$/)) {
    // if something other than a number is passed, redirect again to dropdown.
    res.redirect("/dropdown");
  } else {
    // save dropdownID.
    var dropdownID = req.params.id;

    // create the query.
    var query = "UPDATE dropdown SET isDisabled = 1 WHERE dropdownID = ?";

    // call query on db.
    db.query(query, [dropdownID], function (err, data) {
      if (err) {
        console.log(err);
      }
    });

    // redirect to home after success.
    res.redirect("/dropdown");
  }
});

/* ENABLE dropdown value */
router.get("/dropdown/enable/:id", (req, res, next) => {
  // validate to make sure only a number can be passed here.
  if (!req.params.id.match(/^\d+$/)) {
    // if something other than a number is passed, redirect again to dropdown.
    res.redirect("/dropdown");
  } else {
    // save dropdownID.
    var dropdownID = req.params.id;

    // create the query.
    var query = "UPDATE dropdown SET isDisabled = 0 WHERE dropdownID = ?";

    // call query on db.
    db.query(query, [dropdownID], function (err, data) {
      if (err) {
        console.log(err);
      }
    });

    // redirect to home after success.
    res.redirect("/dropdown");
  }
});

module.exports = router;
