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
  body("firstName").if(body("firstName").notEmpty()).isAlpha().trim(),
  body("lastName").if(body("lastName").notEmpty()).isAlpha().trim(),
  body("homePhone")
    .if(body("homePhone").notEmpty())
    .matches(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/)
    .trim(),
  body("cellPhone")
    .if(body("cellPhone").notEmpty())
    .matches(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/)
    .trim(),
  body("workPhone")
    .if(body("workPhone").notEmpty())
    .matches(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/)
    .trim(),
  body("email").if(body("email").notEmpty()).isEmail().trim(),
  body("address").if(body("address").notEmpty()).isAlphanumeric().trim(),
  body("poBoxAptRR").if(body("poBoxAptRR").notEmpty()).isNumeric().trim(),
  body("town").if(body("town").notEmpty()).isAlpha().trim(),
  body("postalCode").if(body("postalCode").notEmpty()).isAlphanumeric().trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("dogtags/addOwner", {
        title: "BWG | Owner",
        message: "Form Error!",
        formData: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          homePhone: req.body.homePhone,
          cellPhone: req.body.cellPhone,
          workPhone: req.body.workPhone,
          email: req.body.email,
          address: req.body.address,
          poBoxAptRR: req.body.poBoxAptRR,
          town: req.body.town,
          postalCode: req.body.postalCode,
        },
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
