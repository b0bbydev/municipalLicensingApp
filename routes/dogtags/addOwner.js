var express = require("express");
var router = express.Router();
// dbHelpers.
var dbHelpers = require("../../config/dbHelpers");
// express-validate.
const { body, validationResult } = require("express-validator");

/* GET addOwner page. */
router.get("/", async (req, res, next) => {
  // check if there's an error message in the session
  let messages = req.session.messages || [];

  // clear session messages
  req.session.messages = [];

  res.render("dogtags/addOwner", {
    title: "BWG | Add Owner",
    errorMessages: messages,
    email: req.session.email,
  });
});

/* POST addOwner */
router.post(
  "/",
  body("firstName").isAlpha().trim(),
  body("lastName").isAlpha().trim(),
  body("homePhone").isMobilePhone().trim(),
  body("cellPhone").isMobilePhone().trim(),
  body("workPhone").isMobilePhone().trim(),
  body("email").isEmail().trim(),
  body("address").isAlphanumeric().trim(),
  body("poBoxAptRR").isNumeric().trim(),
  body("town").isAlpha().trim(),
  body("postalCode").isAlphanumeric().trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("dogtags/addOwner", {
        title: "BWG | Owner",
        message: "Form Error!",
      });
    } else {
      // insert into owner table.
      dbHelpers.insertOwner(
        req.body.firstName,
        req.body.lastName,
        req.body.homePhone,
        req.body.cellPhone,
        req.body.workPhone,
        req.body.email,
        req.body.address,
        req.body.poBoxAptRR,
        req.body.town,
        req.body.postalCode
      );

      // redirect back to dogtag index after success.
      res.redirect("/dogtags");
    }
  }
);

module.exports = router;
