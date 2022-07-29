var express = require("express");
var router = express.Router();
// models.
const Dropdown = require("../../models/dropdownManager/dropdown");
const HawkerPeddlerApplicant = require("../../models/hawkerPeddler/hawkerPeddlerApplicant");
const HawkerPeddlerApplicantAddress = require("../../models/hawkerPeddler/hawkerPeddlerApplicantAddress");
// express-validate.
const { body, param, validationResult } = require("express-validator");

/* GET /hawkerPeddler/editApplicant/:id */
router.get(
  "/:id",
  param("id").matches(/^\d+$/).trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...),
    if (!errors.isEmpty()) {
      return res.render("hawkerPeddler/editApplicant", {
        title: "BWG | Edit Applicant",
        message: "Page Error!",
        email: req.session.email,
        auth: req.session.auth, // authorization.
      });
    } else {
      // check if there's an error message in the session
      let messages = req.session.messages || [];
      // clear session messages
      req.session.messages = [];

      // get dropdown values.
      var streets = await Dropdown.findAll({
        where: {
          dropdownFormID: 13, // streets
        },
      });

      HawkerPeddlerApplicant.findOne({
        where: {
          hawkerPeddlerApplicantID: req.params.id,
        },
        include: [
          {
            model: HawkerPeddlerApplicantAddress,
          },
        ],
      }).then((results) => {
        return res.render("hawkerPeddler/editApplicant", {
          title: "BWG | Edit Applicant",
          errorMessages: messages,
          email: req.session.email,
          auth: req.session.auth, // authorization.
          streets: streets,
          // populate input fields with existing values.
          formData: {
            firstName: results.firstName,
            lastName: results.lastName,
            phoneNumber: results.phoneNumber,
            email: results.email,
            licenseNumber: results.licenseNumber,
            streetNumber:
              results.hawkerPeddlerApplicantAddresses[0].streetNumber,
            streetName: results.hawkerPeddlerApplicantAddresses[0].streetName,
            town: results.hawkerPeddlerApplicantAddresses[0].town,
            postalCode: results.hawkerPeddlerApplicantAddresses[0].postalCode,
          },
        });
      });
    }
  }
);

/* POST /hawkerPeddler/editApplicant/:id */
router.post(
  "/:id",
  param("id").matches(/^\d+$/).trim(),
  body("firstName")
    .if(body("firstName").notEmpty())
    .matches(/^[a-zA-Z\/\-',. ]*$/)
    .withMessage("Invalid First Name Entry!")
    .trim(),
  body("lastName")
    .if(body("lastName").notEmpty())
    .matches(/^[a-zA-Z\/\-',. ]*$/)
    .withMessage("Invalid Last Name Entry!")
    .trim(),
  body("phoneNumber")
    .if(body("phoneNumber").notEmpty())
    .matches(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/)
    .withMessage("Invalid Phone Number Entry!")
    .trim(),
  body("email")
    .if(body("email").notEmpty())
    .isEmail()
    .withMessage("Invalid Email Entry!")
    .trim(),
  body("licenseNumber")
    .if(body("licenseNumber").notEmpty())
    .matches(/^[a-zA-Z0-9\/\-,.' ]*$/)
    .withMessage("Invalid License Number Entry!")
    .trim(),
  body("streetNumber")
    .if(body("streetNumber").notEmpty())
    .matches(/^[0-9. ]*$/)
    .withMessage("Invalid Street Number Entry!")
    .trim(),
  body("streetName")
    .if(body("streetName").notEmpty())
    .matches(/^[a-zA-Z0-9. ]*$/)
    .withMessage("Invalid Street Name Entry!")
    .trim(),
  body("town")
    .if(body("town").notEmpty())
    .matches(/^[a-zA-Z, ]*$/)
    .withMessage("Invalid Town Entry!")
    .trim(),
  body("postalCode")
    .if(body("postalCode").notEmpty())
    .matches(/^[a-zA-Z0-9- ]*$/)
    .withMessage("Invalid Postal Code Entry!")
    .trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // use built-in array() to convert Result object to array for custom error messages.
    var errorArray = errors.array();

    // if errors is NOT empty (if there are errors...).
    if (!errors.isEmpty()) {
      return res.render("hawkerPeddler/editApplicant", {
        title: "BWG | Edit Applicant",
        errorMessages: errorArray[0].msg,
        email: req.session.email,
        auth: req.session.auth, // authorization.
        dropdownValues: dropdownValues,
        // save form values if submission is unsuccessful.
        formData: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          phoneNumber: req.body.phoneNumber,
          email: req.body.email,
          licenseNumber: req.body.licenseNumber,
          streetNumber: req.body.streetNumber,
          streetName: req.body.streetName,
          town: req.body.town,
          postalCode: req.body.postalCode,
        },
      });
    } else {
      HawkerPeddlerApplicant.update(
        {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          phoneNumber: req.body.phoneNumber,
          email: req.body.email,
          licenseNumber: req.body.licenseNumber,
        },
        {
          where: {
            hawkerPeddlerApplicantID: req.params.id,
          },
        }
      )
        .then(() => {
          HawkerPeddlerApplicantAddress.update(
            {
              streetNumber: req.body.streetNumber,
              streetName: req.body.streetName,
              town: req.body.town,
              postalCode: req.body.postalCode,
            },
            {
              where: {
                hawkerPeddlerApplicantID: req.params.id,
              },
            }
          );
        })
        .then(() => {
          return res.redirect(
            "/hawkerPeddler/business/" + req.session.hawkerPeddlerBusinessID
          );
        })
        .catch((err) => {
          return res.render("hawkerPeddler/editApplicant", {
            title: "BWG | Edit Applicant",
            message: "Page Error!",
          });
        });
    }
  }
);

module.exports = router;
