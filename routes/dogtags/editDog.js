var express = require("express");
var router = express.Router();
// models.
const Dog = require("../../models/dogtags/dog");
const Dropdown = require("../../models/dropdownManager/dropdown");
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

      // get dropdown values.
      var dropdownValues = await Dropdown.findAll({
        where: {
          dropdownFormID: 11, // the specific ID for this dropdown menu. Maybe change to something dynamic? Not sure of the possiblities as of yet.
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
            errorMessages: messages,
            email: req.session.email,
            auth: req.session.auth, // authorization.
            dropdownValues: dropdownValues,
            dogInfo: {
              tagNumber: results.tagNumber,
              dogName: results.dogName,
              breed: results.breed,
              colour: results.colour,
              dateOfBirth: results.dateOfBirth,
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
    .matches(/^[0-9-]*$/)
    .withMessage("Invalid Tag Number Entry!")
    .trim(),
  body("dogName")
    .if(body("dogName").notEmpty())
    .matches(/^[a-zA-Z\/\- ]*$/)
    .withMessage("Invalid Dog Name Entry!")
    .trim(),
  body("breed")
    .if(body("breed").notEmpty())
    .matches(/^[a-zA-Z\/\-,. ]*$/)
    .withMessage("Invalid Breed Entry!")
    .trim(),
  body("colour")
    .if(body("colour").notEmpty())
    .matches(/^[a-zA-Z\/\- ]*$/)
    .withMessage("Invalid Colour Entry!")
    .trim(),
  body("dateOfBirth")
    .if(body("dateOfBirth").exists())
    .matches(/^\d{4}-\d{2}-\d{2}$/)
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
    .matches(/^[a-zA-Z0-9\/\-,. ]*$/)
    .withMessage("Invalid Rabies Tag Number Entry!")
    .trim(),
  body("rabiesExpiry")
    .if(body("rabiesExpiry").exists())
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("Invalid Rabies Expiry Entry!")
    .trim(),
  body("vetOffice")
    .if(body("vetOffice").notEmpty())
    .matches(/^[a-zA-Z0-9, ]*$/)
    .withMessage("Invalid Vet Office Entry!")
    .trim(),
  body("vendor")
    .if(body("vendor").notEmpty())
    .matches(/^[a-zA-Z\/\- ]*$/)
    .withMessage("Invalid Vendor Entry!")
    .trim(),
  body("notes")
    .if(body("notes").notEmpty())
    .matches(/^[\r\na-zA-Z0-9\/\-, ]+/)
    .withMessage("Invalid Notes Entry!")
    .trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // use built-in array() to convert Result object to array for custom error messages.
    var errorArray = errors.array();

    // get dropdown values.
    var dropdownValues = await Dropdown.findAll({
      where: {
        dropdownFormID: 11,
      },
    });

    // if errors is NOT empty (if there are errors...).
    if (!errors.isEmpty()) {
      return res.render("dogtags/editDog", {
        title: "BWG | Edit Dog",
        message: errorArray[0].msg,
        email: req.session.email,
        auth: req.session.auth, // authorization.
        dropdownValues: dropdownValues,
        // if the form submission is unsuccessful, save their values.
        dogInfo: {
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
      Dog.update(
        {
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
          notes: req.body.notes,
          ownerID: req.session.ownerID,
        },
        {
          where: {
            dogID: req.session.dogID,
          },
        }
      )
        .then(res.redirect("/dogtags/owner/" + req.session.ownerID))
        .catch((err) => {
          return res.render("dogtags/editDog", {
            title: "BWG | Edit Dog",
            message: "Page Error!",
          });
        });
    }
  }
);

module.exports = router;
