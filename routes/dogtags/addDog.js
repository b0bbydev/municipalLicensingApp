var express = require("express");
var router = express.Router();
// models.
const Dog = require("../../models/dogtags/dog");
// express-validate.
const { body, param, validationResult } = require("express-validator");

/* GET /addDog/:id */
router.get(
  "/:id",
  param("id").matches(/^\d+$/).trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...).
    if (!errors.isEmpty()) {
      return res.render("dogtags/addDog", {
        title: "BWG | Add Dog",
        message: "Page Error!",
      });
    } else {
      // check if there's an error message in the session.
      let messages = req.session.messages || [];

      // clear session messages.
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
    .withMessage("Invalid Tag Number Entry!")
    .trim(),
  body("dogName")
    .if(body("dogName").notEmpty())
    .matches(/^[a-zA-z\/\- ]*$/)
    .withMessage("Invalid Dog Name Entry!")
    .trim(),
  body("breed")
    .if(body("breed").notEmpty())
    .matches(/^[a-zA-z\/\-, ]*$/)
    .withMessage("Invalid Breed Entry!")
    .trim(),
  body("colour")
    .if(body("colour").notEmpty())
    .matches(/^[a-zA-z\/\- ]*$/)
    .withMessage("Invalid Colour Entry!")
    .trim(),
  body("dateOfBirth")
    .if(body("dateOfBirth").notEmpty())
    .isDate()
    .withMessage("Invalid Date Of Birth Entry!")
    .trim(),
  body("gender")
    .if(body("gender").notEmpty())
    .isAlpha()
    .withMessage("Invalid Gender Entry!")
    .trim(),
  body("spade")
    .if(body("spade").notEmpty())
    .isAlpha()
    .withMessage("Invalid Spade/Neutered Entry!")
    .trim(),
  body("designation")
    .if(body("designation").notEmpty())
    .isAlpha()
    .withMessage("Invalid Designation Entry!")
    .trim(),
  body("rabiesTagNumber")
    .if(body("rabiesTagNumber").notEmpty())
    .matches(/^[0-9-]*$/)
    .withMessage("Invalid Rabies Tag Number Entry!")
    .trim(),
  body("rabiesExpiry")
    .if(body("rabiesExpiry").notEmpty())
    .isDate()
    .withMessage("Invalid Rabies Expiry Entry!")
    .trim(),
  body("vetOffice")
    .if(body("vetOffice").notEmpty())
    .matches(/^[a-zA-z0-9, ]*$/)
    .withMessage("Invalid Vet Office Entry!")
    .trim(),
  body("vendor")
    .if(body("vendor").notEmpty())
    .matches(/^[a-zA-z\/\- ]*$/)
    .withMessage("Invalid Vendor Entry!")
    .trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // use built-in array() to convert Result object to array for custom error messages.
    var errorArray = errors.array();

    // if errors is NOT empty (if there are errors...).
    if (!errors.isEmpty()) {
      return res.render("dogtags/addDog", {
        title: "BWG | Add Dog",
        message: errorArray[0].msg,
        email: req.session.email,
        // if the form submission is unsuccessful, save their values.
        formData: {
          tagNumber: req.body.tagNumber,
          dogName: req.body.dogName,
          breed: req.body.breed,
          colour: req.body.colour,
          dateOfBirth: req.body.dateOfBirth,
          rabiesTagNumber: req.body.rabiesTagNumber,
          rabiesExpiry: req.body.rabiesExpiry,
          vetOffice: req.body.vetOffice,
          tagRequired: req.body.tagRequired,
          vendor: req.body.vendor,
        },
      });
    } else {
      // get current date for automatic population of license.
      var issueDate = new Date();
      var expiryDate = new Date(issueDate.getFullYear() + 1, 0, 31); // year, month (jan = 0), day

      // create dog with owner and license association.
      Dog.create({
        tagNumber: req.body.tagNumber,
        dogName: req.body.dogName,
        breed: req.body.breed,
        colour: req.body.colour,
        gender: req.body.gender,
        dateOfBirth: req.body.dateOfBirth,
        designation: req.body.designation,
        spade: req.body.spade,
        rabiesTagNumber: req.body.rabiesTagNumber,
        rabiesExpiry: req.body.rabiesExpiry,
        vetOffice: req.body.vetOffice,
        tagRequired: req.body.tagRequired,
        vendor: req.body.vendor,
        issueDate: issueDate,
        expiryDate: expiryDate,
        ownerID: req.session.ownerID,
      });

      // redirect to /dogtags
      res.redirect("/dogtags/owner/" + req.session.ownerID);
    }
  }
);

module.exports = router;
