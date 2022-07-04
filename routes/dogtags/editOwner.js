var express = require("express");
var router = express.Router();
// models.
const Owner = require("../../models/dogtags/owner");
const Address = require("../../models/dogtags/address");
const Dropdown = require("../../models/dropdownManager/dropdown");
// express-validate.
const { body, param, validationResult } = require("express-validator");
// authHelper middleware.
const {
  isLoggedIn,
  dogLicenseAuth,
  adminAuth,
} = require("../../config/authHelpers");
// request limiter.
const limiter = require("../../config/limiter");

/* GET /editOwner page */
router.get(
  "/:id",
  limiter,
  param("id").matches(/^\d+$/).trim(), // ensure only a number is passed into the params.
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...),
    if (!errors.isEmpty()) {
      return res.render("dogtags", {
        title: "BWG | Owner",
        message: "Error!",
        email: req.session.email,
        dogAuth: req.session.dogAuth,
        admin: req.session.admin,
      });
    } else {
      // check if there's an error message in the session,
      let messages = req.session.messages || [];
      // clear session messages,
      req.session.messages = [];

      // send ownerID to session; should be safe to do so here after validation.
      req.session.ownerID = req.params.id;

      // get dropdown values.
      var dropdownValues = await Dropdown.findAll({
        where: {
          dropdownFormID: 13,
        },
      });

      Owner.findOne({
        where: {
          ownerID: req.session.ownerID,
        },
        include: [
          {
            model: Address,
          },
        ],
      })
        .then((results) => {
          return res.render("dogtags/editOwner", {
            title: "BWG | Edit Owner",
            errorMessages: messages,
            email: req.session.email,
            dogAuth: req.session.dogAuth,
            admin: req.session.admin,
            ownerID: req.session.ownerID,
            dropdownValues: dropdownValues,
            ownerInfo: {
              firstName: results.firstName,
              lastName: results.lastName,
              homePhone: results.homePhone,
              cellPhone: results.cellPhone,
              workPhone: results.workPhone,
              email: results.email,
              streetNumber: results.addresses[0].streetNumber,
              streetName: results.addresses[0].streetName,
              poBoxAptRR: results.addresses[0].poBoxAptRR,
              town: results.addresses[0].town,
              postalCode: results.addresses[0].postalCode,
            },
          });
        })
        .catch((err) => {
          return res.render("dogtags/editOwner", {
            title: "BWG | Edit Owner",
            message: "Page Error!",
          });
        });
    }
  }
);

/* POST /editOwner */
router.post(
  "/:id",
  limiter,
  param("id").matches(/^\d+$/).trim(),
  body("firstName")
    .if(body("firstName").notEmpty())
    .matches(/^[a-zA-Z\'-]*$/)
    .withMessage("Invalid First Name Entry!")
    .trim(),
  body("lastName")
    .if(body("lastName").notEmpty())
    .matches(/^[a-zA-Z\'-]*$/)
    .withMessage("Invalid Last Name Entry!")
    .trim(),
  body("homePhone")
    .if(body("homePhone").notEmpty())
    .matches(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/)
    .withMessage("Invalid Home Phone Number Entry!")
    .trim(),
  body("cellPhone")
    .if(body("cellPhone").notEmpty())
    .matches(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/)
    .withMessage("Invalid Cell Phone Number Entry!")
    .trim(),
  body("workPhone")
    .if(body("workPhone").notEmpty())
    .matches(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/)
    .withMessage("Invalid Work Phone Number Entry!")
    .trim(),
  body("email")
    .if(body("email").notEmpty())
    .isEmail()
    .withMessage("Invalid Email Entry!")
    .trim(),
  body("streetNumber")
    .if(body("address").notEmpty())
    .matches(/^[0-9. ]*$/)
    .withMessage("Invalid Street Number Entry!")
    .trim(),
  body("streetName")
    .if(body("address").notEmpty())
    .matches(/^[a-zA-Z. ]*$/)
    .withMessage("Invalid Street Name Entry!")
    .trim(),
  body("poBoxAptRR")
    .if(body("poBoxAptRR").notEmpty())
    .matches(/^[a-zA-Z0-9. ]*$/)
    .withMessage("Invalid PO Box/Apt/RR Entry!")
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

    // get dropdown values.
    var dropdownValues = await Dropdown.findAll({
      where: {
        dropdownFormID: 13,
      },
    });

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("dogtags/editOwner", {
        title: "BWG | Edit Owner",
        message: errorArray[0].msg,
        email: req.session.email,
        dogAuth: req.session.dogAuth,
        admin: req.session.admin,
        dropdownValues: dropdownValues,
        // if the form submission is unsuccessful, save their values.
        ownerInfo: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          homePhone: req.body.homePhone,
          cellPhone: req.body.cellPhone,
          workPhone: req.body.workPhone,
          email: req.body.email,
          streetNumber: req.body.streetNumber,
          streetName: req.body.streetName,
          poBoxAptRR: req.body.poBoxAptRR,
          town: req.body.town,
          postalCode: req.body.postalCode,
        },
      });
    } else {
      // update owner.
      Owner.update(
        {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          homePhone: req.body.homePhone,
          cellPhone: req.body.cellPhone,
          workPhone: req.body.workPhone,
          email: req.body.email,
        },
        {
          where: {
            ownerID: req.session.ownerID,
          },
        }
      )
        .then((result) => {
          // update Address.
          Address.update(
            {
              streetNumber: req.body.streetNumber,
              streetName: req.body.streetName,
              poBoxAptRR: req.body.poBoxAptRR,
              town: req.body.town,
              postalCode: req.body.postalCode,
            },
            {
              where: {
                ownerID: req.session.ownerID,
              },
            }
          );
        })
        // redirect back to dogtags.
        .then(res.redirect("/dogtags"))
        .catch((err) => {
          return res.render("dogtags/editOwner", {
            title: "BWG | Edit Owner",
            message: "Page Error!",
          });
        });
    }
  }
);

module.exports = router;
