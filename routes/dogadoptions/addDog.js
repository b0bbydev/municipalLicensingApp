var express = require("express");
var router = express.Router();
// models.
const AdoptedDog = require("../../models/dogAdoptions/adoptedDog");
// express-validate.
const { body, validationResult } = require("express-validator");

/* GET /addDog */
router.get("/", async (req, res, next) => {
  // server side validation.
  const errors = validationResult(req);

  // if errors is NOT empty (if there are errors...).
  if (!errors.isEmpty()) {
    return res.render("dogAdoptions/addDog", {
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

    return res.render("dogAdoptions/addDog", {
      title: "BWG | Add Dog",
      message: messages,
      email: req.session.email,
      auth: req.session.auth, // authorization.
    });
  }
});

/* POST /addDog */
router.post(
  "/",
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
  body("notes")
    .if(body("notes").notEmpty())
    .matches(/^[^%<>^\\;!{}?]+$/)
    .withMessage("Invalid Notes Entry!")
    .trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // use built-in array() to convert Result object to array for custom error messages.
    var errorArray = errors.array();

    // if errors is NOT empty (if there are errors...).
    if (!errors.isEmpty()) {
      return res.render("dogAdoptions/addDog", {
        title: "BWG | Add Dog",
        message: errorArray[0].msg, // custom error message. (should indicate which field has the error.)
        email: req.session.email,
        auth: req.session.auth, // authorization.
        // if the form submission is unsuccessful, save their values.
        formData: {
          dogName: req.body.dogName,
          breed: req.body.breed,
          dateOfAdoption: req.body.dateOfAdoption,
          colour: req.body.colour,
          gender: req.body.gender,
          notes: req.body.notes,
        },
      });
    } else {
      // create dog.
      AdoptedDog.create({
        dogName: req.body.dogName,
        breed: req.body.breed,
        dateOfAdoption: req.body.dateOfAdoption,
        colour: req.body.colour,
        gender: req.body.gender,
        notes: req.body.notes,
      })
        .then(() => {
          return res.redirect("/dogAdoptions");
        })
        .catch((err) => {
          return res.render("dogAdoptions/addDog", {
            title: "BWG | Add Dog",
            message: "Page Error!",
            auth: req.session.auth, // authorization.
          });
        });
    }
  }
);

module.exports = router;
