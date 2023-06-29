var express = require("express");
var router = express.Router();
// models.
const AdoptedDog = require("../../models/dogAdoptions/adoptedDog");
// express-validate.
const { body, param, validationResult } = require("express-validator");

/* GET /editDog/:id */
router.get(
  "/:id",
  param("id").matches(/^\d+$/).trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...),
    if (!errors.isEmpty()) {
      return res.render("dogAdoptions/editDog", {
        title: "BWG | Edit Dog",
        message: "Page Error!",
        email: req.session.email,
        auth: req.session.auth, // authorization.
      });
    } else {
      // check if there's an error message in the session,
      let messages = req.session.messages || [];
      // clear session messages,
      req.session.messages = [];

      // send dogID to session; should be safe to do so here after validation.
      req.session.adoptedDogID = req.params.id;

      // populate input fields with existing values.
      AdoptedDog.findOne({
        where: {
          adoptedDogID: req.session.adoptedDogID,
        },
      })
        .then((results) => {
          return res.render("dogAdoptions/editDog", {
            title: "BWG | Edit Dog",
            message: messages,
            email: req.session.email,
            auth: req.session.auth, // authorization.
            // existing values.
            adoptedDogInfo: {
              dogName: results.dogName,
              dateOfAdoption: results.dateOfAdoption,
              breed: results.breed,
              colour: results.colour,
              gender: results.gender,
              notes: results.notes,
            },
          });
        })
        .catch((err) => {
          return res.render("dogAdoptions/editDog", {
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
    .isEmail()
    .withMessage("Invalid Colour Entry!")
    .trim(),
  body("gender")
    .if(body("gender").notEmpty())
    .matches(/^[^%<>^$\\;!{}?]+$/)
    .withMessage("Invalid Gender Entry!")
    .trim(),
  body("notes")
    .if(body("notes").notEmpty())
    .matches(/^[^%<>^$\\;!{}?]+$/)
    .withMessage("Invalid Notes Entry!")
    .trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // use built-in array() to convert Result object to array for custom error messages.
    var errorArray = errors.array();

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("dogAdoptions/editDog", {
        title: "BWG | Edit Dog",
        message: errorArray[0].msg,
        email: req.session.email,
        auth: req.session.auth, // authorization.
        // if the form submission is unsuccessful, save their values.
        adoptedDogInfo: {
          dogName: req.body.dogName,
          dateOfAdoption: req.body.dateOfAdoption,
          breed: req.body.breed,
          colour: req.body.colour,
          gender: req.body.gender,
          notes: req.body.notes,
        },
      });
    } else {
      AdoptedDog.update(
        {
          dogName: req.body.dogName,
          dateOfAdoption: req.body.dateOfAdoption,
          breed: req.body.breed,
          colour: req.body.colour,
          gender: req.body.gender,
          notes: req.body.notes,
        },
        {
          where: {
            adoptedDogID: req.session.adoptedDogID,
          },
        }
      )
        .then(() => {
          return res.redirect("/dogAdoptions");
        })
        .catch((err) => {
          return res.render("dogAdoptions/editDog", {
            title: "BWG | Edit Dog",
            message: "Page Error!",
            auth: req.session.auth, // authorization.
          });
        });
    }
  }
);

module.exports = router;
