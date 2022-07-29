var express = require("express");
var router = express.Router();
// models.
const Dropdown = require("../../models/dropdownManager/dropdown");
const RefreshmentVehiclePropertyOwner = require("../../models/refreshmentVehicles/refreshmentVehiclePropertyOwner");
const RefreshmentVehiclePropertyOwnerAddress = require("../../models/refreshmentVehicles/refreshmentVehiclePropertyOwnerAddress");
// express-validate.
const { body, validationResult } = require("express-validator");

/* GET /refreshmentVehicles/editPropertyOwner/:id */
router.get("/:id", async (req, res, next) => {
  // check if there's an error message in the session
  let messages = req.session.messages || [];
  // clear session messages
  req.session.messages = [];

  // get streets.
  var streets = await Dropdown.findAll({
    where: {
      dropdownFormID: 13, // streets
    },
  });

  RefreshmentVehiclePropertyOwner.findOne({
    where: {
      refreshmentVehiclePropertyOwnerID: req.params.id,
    },
    include: [
      {
        model: RefreshmentVehiclePropertyOwnerAddress,
      },
    ],
  }).then((results) => {
    return res.render("refreshmentVehicles/editPropertyOwner", {
      title: "BWG | Edit Property Owner",
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
        streetNumber:
          results.refreshmentVehiclePropertyOwnerAddresses[0].streetNumber,
        streetName:
          results.refreshmentVehiclePropertyOwnerAddresses[0].streetName,
        town: results.refreshmentVehiclePropertyOwnerAddresses[0].town,
        postalCode:
          results.refreshmentVehiclePropertyOwnerAddresses[0].postalCode,
      },
    });
  });
});

/* POST /refreshmentVehicles/editPropertyOwner/:id */
router.post(
  "/:id",
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

    // get streets.
    var streets = await Dropdown.findAll({
      where: {
        dropdownFormID: 13, // streets
      },
    });

    // if errors is NOT empty (if there are errors...).
    if (!errors.isEmpty()) {
      return res.render("refreshmentVehicles/editPropertyOwner", {
        title: "BWG | Edit Property Owner",
        errorMessages: errorArray[0].msg,
        email: req.session.email,
        auth: req.session.auth, // authorization.
        streets: streets,
        // save form values if submission is unsuccessful.
        formData: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          phoneNumber: req.body.phoneNumber,
          email: req.body.email,
          streetNumber: req.body.streetNumber,
          streetName: req.body.streetName,
          town: req.body.town,
          postalCode: req.body.postalCode,
        },
      });
    } else {
      RefreshmentVehiclePropertyOwner.update(
        {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          phoneNumber: req.body.phoneNumber,
          email: req.body.email,
        },
        {
          where: {
            refreshmentVehiclePropertyOwnerID: req.params.id,
          },
        }
      )
        .then(() => {
          RefreshmentVehiclePropertyOwnerAddress.update(
            {
              streetNumber: req.body.streetNumber,
              streetName: req.body.streetName,
              town: req.body.town,
              postalCode: req.body.postalCode,
            },
            {
              where: {
                refreshmentVehiclePropertyOwnerID: req.params.id,
              },
            }
          );
        })
        .then(() => {
          return res.redirect(
            "/refreshmentVehicles/vehicle/" + req.session.refreshmentVehicleID
          );
        })
        .catch((err) => {
          return res.render("refreshmentVehicles/editPropertyOwner", {
            title: "BWG | Edit Property Owner",
            message: "Page Error!",
          });
        });
    }
  }
);

module.exports = router;
