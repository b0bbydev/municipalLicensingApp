var express = require("express");
var router = express.Router();
// models.
const Dog = require("../../models/dogtags/dog");
const Dropdown = require("../../models/dropdownManager/dropdown");
// helpers.
const funcHelpers = require("../../config/funcHelpers");
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
        email: req.session.email,
        auth: req.session.auth, // authorization.
      });
    } else {
      // check if there's an error message in the session.
      let messages = req.session.messages || [];
      // clear session messages.
      req.session.messages = [];

      // get tagRequired options.
      var tagRequiredOptions = await Dropdown.findAll({
        where: {
          dropdownFormID: 11,
        },
      });

      // vendor values.
      var vendorValues = await Dropdown.findAll({
        where: {
          dropdownFormID: 10,
        },
      });

      return res.render("dogtags/addDog", {
        title: "BWG | Add Dog",
        errorMessages: messages,
        email: req.session.email,
        auth: req.session.auth, // authorization.
        tagRequiredOptions: tagRequiredOptions,
        vendorValues: vendorValues,
      });
    }
  }
);

/* POST /addDog */
router.post(
  "/:id",
  param("id").matches(/^\d+$/).trim(),
  body("tagNumber")
    .if(body("tagNumber").notEmpty())
    .matches(/^[^%<>^$\/\\;!{}?]+$/)
    .withMessage("Invalid Tag Number Entry!")
    .trim(),
  body("dogName")
    .if(body("dogName").notEmpty())
    .matches(/^[^%<>^$\/\\;!{}?]+$/)
    .withMessage("Invalid Dog Name Entry!")
    .trim(),
  body("breed")
    .if(body("breed").notEmpty())
    .matches(/^[^%<>^$\/\\;!{}?]+$/)
    .withMessage("Invalid Breed Entry!")
    .trim(),
  body("colour")
    .if(body("colour").notEmpty())
    .matches(/^[^%<>^$\/\\;!{}?]+$/)
    .withMessage("Invalid Colour Entry!")
    .trim(),
  body("gender")
    .if(body("gender").notEmpty())
    .matches(/^[^%<>^$\/\\;!{}?]+$/)
    .withMessage("Invalid Gender Entry!")
    .trim(),
  body("spade")
    .if(body("spade").notEmpty())
    .matches(/^[^%<>^$\/\\;!{}?]+$/)
    .withMessage("Invalid Spade/Neutered Entry!")
    .trim(),
  body("designation")
    .if(body("designation").notEmpty())
    .matches(/^[^%<>^$\/\\;!{}?]+$/)
    .withMessage("Invalid Designation Entry!")
    .trim(),
  body("rabiesTagNumber")
    .if(body("rabiesTagNumber").notEmpty())
    .matches(/^[^%<>^$\/\\;!{}?]+$/)
    .withMessage("Invalid Rabies Tag Number Entry!")
    .trim(),
  body("vetOffice")
    .if(body("vetOffice").notEmpty())
    .matches(/^[^%<>^$\/\\;!{}?]+$/)
    .withMessage("Invalid Vet Office Entry!")
    .trim(),
  body("vendor")
    .if(body("vendor").notEmpty())
    .matches(/^[^%<>^$\/\\;!{}?]+$/)
    .withMessage("Invalid Vendor Entry!")
    .trim(),
  body("notes")
    .if(body("notes").notEmpty())
    .matches(/^[\r\na-zA-Z0-9\/\-,.:"' ]+/)
    .withMessage("Invalid Notes Entry!")
    .trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // use built-in array() to convert Result object to array for custom error messages.
    var errorArray = errors.array();

    // get tagRequired options.
    var tagRequiredOptions = await Dropdown.findAll({
      where: {
        dropdownFormID: 11,
      },
    });

    // vendor values.
    var vendorValues = await Dropdown.findAll({
      where: {
        dropdownFormID: 10,
      },
    });

    // if errors is NOT empty (if there are errors...).
    if (!errors.isEmpty()) {
      return res.render("dogtags/addDog", {
        title: "BWG | Add Dog",
        message: errorArray[0].msg, // custom error message. (should indicate which field has the error.)
        email: req.session.email,
        auth: req.session.auth, // authorization.
        // if the form submission is unsuccessful, save their values.
        tagRequiredOptions: tagRequiredOptions,
        vendorValues: vendorValues,
        formData: {
          tagNumber: req.body.tagNumber,
          dogName: req.body.dogName,
          breed: req.body.breed,
          colour: req.body.colour,
          dateOfBirth: req.body.dateOfBirth,
          gender: req.body.gender,
          spade: req.body.spade,
          designation: req.body.designation,
          rabiesTagNumber: req.body.rabiesTagNumber,
          rabiesExpiry: req.body.rabiesExpiry,
          vetOffice: req.body.vetOffice,
          tagRequired: req.body.tagRequired,
          vendor: req.body.vendor,
          notes: req.body.notes,
        },
      });
    } else {
      // get current date for automatic population of license.
      var issueDate = new Date();
      // expiryDate should always be the following year, jan.31.
      var expiryDate = new Date(issueDate.getFullYear() + 1, 0, 31); // year, month (jan = 0), day

      // create dog.
      Dog.create({
        tagNumber: req.body.tagNumber,
        dogName: req.body.dogName,
        breed: req.body.breed,
        colour: req.body.colour,
        gender: req.body.gender,
        dateOfBirth: funcHelpers.fixEmptyValue(req.body.dateOfBirth),
        designation: req.body.designation,
        spade: req.body.spade,
        rabiesTagNumber: req.body.rabiesTagNumber,
        rabiesExpiry: funcHelpers.fixEmptyValue(req.body.rabiesExpiry),
        vetOffice: req.body.vetOffice,
        tagRequired: req.body.tagRequired,
        vendor: req.body.vendor,
        notes: req.body.notes,
        issueDate: issueDate,
        expiryDate: expiryDate,
        ownerID: req.session.ownerID,
      })
        .then(() => {
          return res.redirect("/dogtags/owner/" + req.session.ownerID);
        })
        .catch((err) => {
          return res.render("dogtags/addDog", {
            title: "BWG | Add Dog",
            message: "Page Error!",
          });
        });
    }
  }
);

module.exports = router;
