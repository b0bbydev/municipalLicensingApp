var express = require("express");
var router = express.Router();
// models.
const Dog = require("../../models/dogtags/dog");
const Dropdown = require("../../models/dropdownManager/dropdown");
// dbHelpers.
var dbHelpers = require("../../config/dbHelpers");
// express-validate.
const { body, param, validationResult } = require("express-validator");
// authHelper middleware.
const {
  isLoggedIn,
  dogLicenseAuth,
  adminAuth,
} = require("../../config/authHelpers");
// express-rate-limit.
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: "Too many requests! Slow down!",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/* GET /dogtags/editDog/:id */
router.get(
  "/:id",
  limiter,
  isLoggedIn,
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
        dogAuth: req.session.dogAuth,
        admin: req.session.admin,
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

      // get dog info from custom query.
      var dogInfo = await dbHelpers.getDogInfo(req.session.dogID);

      return res.render("dogtags/editDog", {
        title: "BWG | Edit Dog",
        errorMessages: messages,
        email: req.session.email,
        dogAuth: req.session.dogAuth,
        admin: req.session.admin,
        dropdownValues: dropdownValues,
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
          tagRequired: dogInfo[0].tagRequired,
          vendor: dogInfo[0].vendor,
          notes: dogInfo[0].notes,
        },
      });
    }
  }
);

/* POST /editDog/:id */
router.post(
  "/:id",
  limiter,
  isLoggedIn,
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
    .matches(/^[a-zA-z\/\-,. ]*$/)
    .withMessage("Invalid Breed Entry!")
    .trim(),
  body("colour")
    .if(body("colour").notEmpty())
    .matches(/^[a-zA-z\/\- ]*$/)
    .withMessage("Invalid Colour Entry!")
    .trim(),
  body("dateOfBirth")
    .if(body("dateOfBirth").notEmpty())
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
    .matches(/^[0-9-]*$/)
    .withMessage("Invalid Rabies Tag Number Entry!")
    .trim(),
  body("rabiesExpiry")
    .if(body("rabiesExpiry").notEmpty())
    .matches(/^\d{4}-\d{2}-\d{2}$/)
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
  body("notes")
    .if(body("notes").notEmpty())
    .matches(/^[\r\na-zA-z0-9\/\-, ]+/)
    .withMessage("Invalid Notes Entry!")
    .trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // use built-in array() to convert Result object to array for custom error messages.
    var errorArray = errors.array();

    // if errors is NOT empty (if there are errors...).
    if (!errors.isEmpty()) {
      return res.render("dogtags/editDog", {
        title: "BWG | Edit Dog",
        message: errorArray[0].msg,
        email: req.session.email,
        dogAuth: req.session.dogAuth,
        admin: req.session.admin,
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
        .then((results) => {
          // redirect to /dogtags
          res.redirect("/dogtags/owner/" + req.session.ownerID);
        })
        .catch((err) => {
          return res.render("dogtags/editDog", {
            title: "BWG | Edit Dog",
            message: "Page Error! ",
          });
        });
    }
  }
);

module.exports = router;
