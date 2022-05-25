var express = require("express");
var router = express.Router();
// dbHelpers.
var dbHelpers = require("../../config/dbHelpers");
// express-validate.
const { body, param, validationResult } = require("express-validator");

/* GET /dogtags/editDog/:id */
router.get(
  "/:id",
  param("id").matches(/^\d+$/).trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("dogtags/editDog", {
        title: "BWG | Edit Dog",
        message: "Page Error!",
      });
    } else {
      // check if there's an error message in the session
      let messages = req.session.messages || [];

      // clear session messages
      req.session.messages = [];

      // get dog info from custom query.
      var dogInfo = await dbHelpers.getDogInfo(req.params.id);

      return res.render("dogtags/editDog", {
        title: "BWG | Edit Dog",
        errorMessages: messages,
        email: req.session.email,
        dogInfo: {
          tagNumber: dogInfo[0].tagNumber,
          dogName: dogInfo[0].dogName,
          breed: dogInfo[0].breed,
          colour: dogInfo[0].colour,
          dateOfBirth: dogInfo[0].dateOfBirth,
          gender: dogInfo[0].gender,
          spade: dogInfo[0].spade,
          designation: dogInfo[0].designation,
          rabiesTagNumber: dogInfo[0].rabiesTagNumber,
          rabiesExpiry: dogInfo[0].rabiesExpiry,
          vetOffice: dogInfo[0].vetOffice,
          issueDate: dogInfo[0].issueDate,
          expiryDate: dogInfo[0].expiryDate,
        },
      });
    }
  }
);

/* POST /editDog/:id */
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
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("dogtags/editDog", {
        title: "BWG | Edit Dog",
        message: "Form Error!",
        email: req.session.email,
        dogInfo: {
          tagNumber: req.body.tagNumber,
          dogName: req.body.dogName,
          breed: req.body.breed,
          colour: req.body.colour,
          dateOfBirth: req.body.dateOfBirth,
          rabiesTagNumber: req.body.rabiesTagNumber,
          rabiesExpiry: req.body.rabiesExpiry,
          vetOffice: req.body.vetOffice,
        },
      });
    } else {
      // update dog.
      dbHelpers.updateDog(
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
        req.params.id // dogID
      );

      // redirect to /dogtags
      res.redirect("/dogtags/owner/" + req.session.ownerID);
    }
  }
);

module.exports = router;
