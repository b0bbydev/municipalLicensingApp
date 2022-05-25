var express = require("express");
var router = express.Router();
// dbHelpers.
var dbHelpers = require("../../config/dbHelpers");
// express-validate.
const { body, param, validationResult } = require("express-validator");

/* GET /addDog/:id */
router.get(
  "/:id",
  param("id").matches(/^\d+$/).trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("dogtags/addDog", {
        title: "BWG | Add Dog",
        message: "Page Error!",
      });
    } else {
      // check if there's an error message in the session
      let messages = req.session.messages || [];

      // clear session messages
      req.session.messages = [];

      return res.render("dogtags/addDog", {
        title: "BWG | Add Dog",
        errorMessages: messages,
        email: req.session.email,
      });
    }
  }
);

/* POST addDog page. */
router.post(
  "/:id",
  body("tagNumber")
    .if(body("tagNumber").notEmpty())
    .matches(/^[0-9-]*$/)
    .trim(),
  body("dogName")
    .if(body("dogName").notEmpty())
    .matches(/^[a-zA-Z\'-]*$/)
    .trim(),
  body("breed")
    .if(body("breed").notEmpty())
    .matches(/^[a-zA-z\/\- ]*$/)
    .trim(),
  body("colour")
    .if(body("colour").notEmpty())
    .matches(/^[a-zA-z\/\- ]*$/)
    .trim(),
  body("dateOfBirth").if(body("dateOfBirth").notEmpty()).isDate().trim(),
  body("gender").if(body("gender").notEmpty()).isAlpha().trim(),
  body("spade").if(body("spade").notEmpty()).isAlpha().trim(),
  body("designation").if(body("designation").notEmpty()).isAlpha().trim(),
  body("rabiesTagNumber")
    .if(body("rabiesTagNumber").notEmpty())
    .matches(/^[0-9-]*$/)
    .trim(),
  body("rabiesExpiry").if(body("rabiesExpiry").notEmpty()).isDate().trim(),
  body("vetOffice")
    .if(body("vetOffice").notEmpty())
    .matches(/^[\.a-zA-Z0-9, ]*$/)
    .trim(),
  body("issueDate").if(body("issueDate").notEmpty()).isDate().trim(),
  body("expiryDate").if(body("expiryDate").notEmpty()).isDate().trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("dogtags/addDog", {
        title: "BWG | Add Dog",
        message: "Form Error!",
        email: req.session.email,
        formData: {
          tagNumber: req.body.tagNumber,
          dogName: req.body.dogName,
          breed: req.body.breed,
          colour: req.body.colour,
          dateOfBirth: req.body.dateOfBirth,
          rabiesTagNumber: req.body.rabiesTagNumber,
          rabiesExpiry: req.body.rabiesExpiry,
          vetOffice: req.body.vetOffice,
          issueDate: req.body.issueDate,
          expiryDate: req.body.expiryDate,
        },
      });
    } else {
      // insert dog & license into db.
      dbHelpers.insertDog(
        req.body.tagNumber,
        req.body.dogName,
        req.body.breed,
        req.body.colour,
        req.body.dateOfBirth,
        req.body.gender,
        req.body.spade,
        req.body.designation,
        req.body.rabiesTagNumber,
        req.body.rabiesExpiry,
        req.body.vetOffice,
        req.session.ownerID,
        // license
        req.body.issueDate,
        req.body.expiryDate,
        req.session.ownerID
      );

      // redirect to /dogtags
      res.redirect("/dogtags");
    }
  }
);

module.exports = router;
