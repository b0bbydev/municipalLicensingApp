var express = require("express");
var router = express.Router();
// models.
const Dog = require("../../models/dogtags/dog");
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

/* GET /addDog/:id */
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
      return res.render("dogtags/addDog", {
        title: "BWG | Add Dog",
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

      return res.render("dogtags/addDog", {
        title: "BWG | Add Dog",
        errorMessages: messages,
        email: req.session.email,
        dogAuth: req.session.dogAuth,
        admin: req.session.admin,
      });
    }
  }
);

/* POST addDog page. */
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
    .matches(/^[a-zA-z0-9\/\-, ]*$/)
    .withMessage("Invalid Notes Entry!")
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
        dogAuth: req.session.dogAuth,
        admin: req.session.admin,
        // if the form submission is unsuccessful, save their values.
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
      // handle date validation seperate because express-validate does bad job at dates.
    } else if (!req.body.dateOfBirth || !req.body.rabiesExpiry) {
      return res.render("dogtags/addDog", {
        title: "BWG | Add Dog",
        message: "Invalid Date Format!",
        email: req.session.email,
        dogAuth: req.session.dogAuth,
        admin: req.session.admin,
        // if the form submission is unsuccessful, save their values.
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
        notes: req.body.notes,
        issueDate: issueDate,
        expiryDate: expiryDate,
        ownerID: req.session.ownerID,
      })
        .then((results) => {
          // redirect to /dogtags
          res.redirect("/dogtags/owner/" + req.session.ownerID);
        })
        .catch((err) => {
          return res.render("dogtags/addDog", {
            title: "BWG | Add Dog",
            message: "Page Error! ",
          });
        });
    }
  }
);

module.exports = router;
