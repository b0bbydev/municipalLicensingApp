var express = require("express");
var router = express.Router();
// dbHelpers.
var dbHelpers = require("../../config/dbHelpers");
// express-validate.
const { body, param, validationResult } = require("express-validator");

/* GET /editOwner page */
router.get(
  "/:id",
  param("id").matches(/^\d+$/).trim(), // ensure only a number is passed into the params.
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("dogtags", {
        title: "BWG | Owner",
        message: "Error!",
        email: req.session.email,
      });
    } else {
      // check if there's an error message in the session
      let messages = req.session.messages || [];

      // clear session messages
      req.session.messages = [];

      // send ownerID to session; should be safe to do so here after validation.
      req.session.ownerID = req.params.id;

      // get owner information by ID via custom query.
      var ownerInfo = await dbHelpers.getGetOwnerInfo(req.session.ownerID);

      return res.render("dogtags/editOwner", {
        title: "BWG | Edit Owner",
        errorMessages: messages,
        email: req.session.email,
        ownerID: req.session.ownerID,
        ownerInfo: {
          firstName: ownerInfo[0].firstName,
          lastName: ownerInfo[0].lastName,
          homePhone: ownerInfo[0].homePhone,
          cellPhone: ownerInfo[0].cellPhone,
          workPhone: ownerInfo[0].workPhone,
          email: ownerInfo[0].email,
          address: ownerInfo[0].address,
          poBoxAptRR: ownerInfo[0].poBoxAptRR,
          town: ownerInfo[0].town,
          postalCode: ownerInfo[0].postalCode,
        },
      });
    }
  }
);

/* POST /editOwner */
router.post(
  "/:id",
  param("id").matches(/^\d+$/).trim(),
  body("firstName")
    .if(body("firstName").notEmpty())
    .matches(/^[a-zA-Z\'-]*$/)
    .trim(),
  body("lastName")
    .if(body("lastName").notEmpty())
    .matches(/^[a-zA-Z\'-]*$/)
    .trim(),
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
  body("address")
    .if(body("address").notEmpty())
    .matches(/^[a-zA-z0-9. ]*$/)
    .trim(),
  body("poBoxAptRR")
    .if(body("poBoxAptRR").notEmpty())
    .matches(/^[a-zA-z0-9. ]*$/)
    .trim(),
  body("town")
    .if(body("town").notEmpty())
    .matches(/^[a-zA-z, ]*$/)
    .trim(),
  body("postalCode")
    .if(body("postalCode").notEmpty())
    .matches(/^[a-zA-z0-9- ]*$/)
    .trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("dogtags/editOwner", {
        title: "BWG | Edit Owner",
        message: "Form Error!",
      });
    } else {
      // insert into owner table.
      dbHelpers.updateOwner(
        req.body.firstName,
        req.body.lastName,
        req.body.homePhone,
        req.body.cellPhone,
        req.body.workPhone,
        req.body.email,
        req.body.address,
        req.body.poBoxAptRR,
        req.body.town,
        req.body.postalCode,
        req.session.ownerID
      );

      // redirect back to dogtag index after success.
      res.redirect("/dogtags");
    }
  }
);

module.exports = router;
