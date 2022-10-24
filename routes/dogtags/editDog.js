var express = require("express");
var router = express.Router();
// models.
const Dog = require("../../models/dogtags/dog");
const Dropdown = require("../../models/dropdownManager/dropdown");
// helpers.
const funcHelpers = require("../../config/funcHelpers");
// express-validate.
const { body, param, validationResult } = require("express-validator");

/* GET /dogtags/editDog/:id */
router.get(
  "/:id",
  param("id").matches(/^\d+$/).trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...).
    if (!errors.isEmpty()) {
      return res.render("dogtags/editDog", {
        title: "BWG | Edit Dog",
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

      // save dogID to session.
      req.session.dogID = req.params.id;

      // used to populate edit form fields.
      Dog.findOne({
        where: {
          dogID: req.session.dogID,
        },
      })
        .then((results) => {
          return res.render("dogtags/editDog", {
            title: "BWG | Edit Dog",
            message: messages,
            email: req.session.email,
            auth: req.session.auth, // authorization.
            tagRequiredOptions: tagRequiredOptions,
            vendorValues: vendorValues,
            // for populating input fields with existing values.
            dogInfo: {
              tagNumber: results.tagNumber,
              dogName: results.dogName,
              breed: results.breed,
              colour: results.colour,
              dateOfBirth: results.dateOfBirth,
              expiryDate: results.expiryDate,
              gender: results.gender,
              spade: results.spade,
              designation: results.designation,
              rabiesTagNumber: results.rabiesTagNumber,
              rabiesExpiry: results.rabiesExpiry,
              vetOffice: results.vetOffice,
              tagRequired: results.tagRequired,
              vendor: results.vendor,
              notes: results.notes,
            },
          });
        })
        .catch((err) => {
          return res.render("dogtags/editDog", {
            title: "BWG | Edit Dog",
            message: "Page Error!",
            auth: req.session.auth, // authorization.
          });
        });
    }
  }
);

/* POST /editDog/:id */
router.post(
  "/:id",
  param("id").matches(/^\d+$/).trim(),
  body("tagNumber")
    .if(body("tagNumber").notEmpty())
    .matches(/^[^%<>^$\\;!{}?]+$/)
    .withMessage("Invalid Tag Number Entry!")
    .trim(),
  body("dogName")
    .if(body("dogName").notEmpty())
    .matches(/^[^%<>^$\\;!{}?]+$/)
    .withMessage("Invalid Dog Name Entry!")
    .trim(),
  body("breed")
    .if(body("breed").notEmpty())
    .matches(/^[^%<>^$\\;!{}?]+$/)
    .withMessage("Invalid Breed Entry!")
    .trim(),
  body("colour")
    .if(body("colour").notEmpty())
    .matches(/^[^%<>^$\\;!{}?]+$/)
    .withMessage("Invalid Colour Entry!")
    .trim(),
  body("gender")
    .if(body("gender").notEmpty())
    .matches(/^[^%<>^$\\;!{}?]+$/)
    .withMessage("Invalid Gender Entry!")
    .trim(),
  body("spade")
    .if(body("spade").notEmpty())
    .matches(/^[^%<>^$\\;!{}?]+$/)
    .withMessage("Invalid Spade/Neutered Entry!")
    .trim(),
  body("designation")
    .if(body("designation").notEmpty())
    .matches(/^[^%<>^$\\;!{}?]+$/)
    .withMessage("Invalid Designation Entry!")
    .trim(),
  body("rabiesTagNumber")
    .if(body("rabiesTagNumber").notEmpty())
    .matches(/^[^%<>^$\\;!{}?]+$/)
    .withMessage("Invalid Rabies Tag Number Entry!")
    .trim(),
  body("vetOffice")
    .if(body("vetOffice").notEmpty())
    .matches(/^[^%<>^$\\;!{}?]+$/)
    .withMessage("Invalid Vet Office Entry!")
    .trim(),
  body("vendor")
    .if(body("vendor").notEmpty())
    .matches(/^[^%<>^$\\;!{}?]+$/)
    .withMessage("Invalid Vendor Entry!")
    .trim(),
  body("notes")
    .if(body("notes").notEmpty())
    .matches(/^[^%<>^\/\\;!{}?]+$/)
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
      return res.render("dogtags/editDog", {
        title: "BWG | Edit Dog",
        message: errorArray[0].msg,
        email: req.session.email,
        auth: req.session.auth, // authorization.
        tagRequiredOptions: tagRequiredOptions,
        vendorValues: vendorValues,
        // if the form submission is unsuccessful, save their values.
        dogInfo: {
          tagNumber: req.body.tagNumber,
          dogName: req.body.dogName,
          breed: req.body.breed,
          colour: req.body.colour,
          dateOfBirth: req.body.dateOfBirth,
          expiryDate: req.body.expiryDate,
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
      Dog.update(
        {
          tagNumber: req.body.tagNumber,
          dogName: req.body.dogName,
          breed: req.body.breed,
          colour: req.body.colour,
          gender: req.body.gender,
          dateOfBirth: funcHelpers.fixEmptyValue(req.body.dateOfBirth),
          expiryDate: funcHelpers.fixEmptyValue(req.body.expiryDate),
          designation: req.body.designation,
          spade: req.body.spade,
          rabiesTagNumber: req.body.rabiesTagNumber,
          rabiesExpiry: funcHelpers.fixEmptyValue(req.body.rabiesExpiry),
          vetOffice: req.body.vetOffice,
          tagRequired: req.body.tagRequired,
          vendor: req.body.vendor,
          notes: req.body.notes,
          ownerID: req.session.ownerID,
        },
        {
          where: {
            dogID: req.session.dogID,
          },
        }
      )
        .then(() => {
          return res.redirect("/dogtags/owner/" + req.session.ownerID);
        })
        .catch((err) => {
          return res.render("dogtags/editDog", {
            title: "BWG | Edit Dog",
            message: "Page Error!",
            auth: req.session.auth, // authorization.
          });
        });
    }
  }
);

module.exports = router;
