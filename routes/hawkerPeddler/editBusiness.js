var express = require("express");
var router = express.Router();
// models.
const Dropdown = require("../../models/dropdownManager/dropdown");
const HawkerPeddlerBusiness = require("../../models/hawkerPeddler/hawkerPeddlerBusiness");
const HawkerPeddlerBusinessAddress = require("../../models/hawkerPeddler/hawkerPeddlerBusinessAddress");
// helpers.
const funcHelpers = require("../../config/funcHelpers");
// express-validate.
const { body, validationResult } = require("express-validator");

/* GET /hawkerPeddler/editBusiness/:id */
router.get("/:id", async (req, res, next) => {
  // check if there's an error message in the session
  let messages = req.session.messages || [];
  // clear session messages
  req.session.messages = [];

  // get dropdown values.
  var dropdownValues = await Dropdown.findAll({
    where: {
      dropdownFormID: 13, // streets
    },
  });

  HawkerPeddlerBusiness.findOne({
    where: {
      hawkerPeddlerBusinessID: req.params.id,
    },
    include: [
      {
        model: HawkerPeddlerBusinessAddress,
      },
    ],
  }).then((results) => {
    return res.render("hawkerPeddler/editBusiness", {
      title: "BWG | Edit Business",
      errorMessages: messages,
      email: req.session.email,
      auth: req.session.auth, // authorization.
      dropdownValues: dropdownValues,
      // populate input fields with exisitng values.
      formData: {
        businessName: results.businessName,
        phoneNumber: results.phoneNumber,
        email: results.email,
        issueDate: results.issueDate,
        expiryDate: results.expiryDate,
        policeVSC: results.policeVSC,
        photoID: results.photoID,
        sitePlan: results.sitePlan,
        zoningClearance: results.zoningClearance,
        itemsForSale: results.itemsForSale,
        notes: results.notes,
        streetNumber: results.hawkerPeddlerBusinessAddresses[0].streetNumber,
        streetName: results.hawkerPeddlerBusinessAddresses[0].streetName,
        town: results.hawkerPeddlerBusinessAddresses[0].town,
        postalCode: results.hawkerPeddlerBusinessAddresses[0].postalCode,
      },
    });
  });
});

/* POST /hawkerPeddler/editBusiness/:id */
router.post(
  "/:id",
  body("businessName")
    .if(body("businessName").notEmpty())
    .matches(/^[ a-zA-Z0-9\'-]*$/)
    .withMessage("Invalid Business Name Entry!")
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
  body("itemsForSale")
    .if(body("itemsForSale").notEmpty())
    .matches(/^[\r\na-zA-Z0-9\/\-,.:"' ]+/)
    .withMessage("Invalid Items For Sale Entry!")
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

    // get dropdown values.
    var dropdownValues = await Dropdown.findAll({
      where: {
        dropdownFormID: 13, // streets
      },
    });

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("hawkerPeddler/editBusiness", {
        title: "BWG | Edit Business",
        message: errorArray[0].msg, // custom error message. (should indicate which field has the error.)
        email: req.session.email,
        auth: req.session.auth, // authorization.
        dropdownValues: dropdownValues,
        // if the form submission is unsuccessful, save their values.
        formData: {
          businessName: req.body.businessName,
          phoneNumber: req.body.phoneNumber,
          email: req.body.email,
          issueDate: req.body.issueDate,
          expiryDate: req.body.expiryDate,
          policeVSC: req.body.policeVSC,
          photoID: req.body.photoID,
          sitePlan: req.body.sitePlan,
          zoningClearance: req.body.zoningClearance,
          itemsForSale: req.body.itemsForSale,
          notes: req.body.notes,
          streetNumber: req.body.streetNumber,
          streetName: req.body.streetName,
          town: req.body.town,
          postalCode: req.body.postalCode,
        },
      });
    } else {
      // create business.
      HawkerPeddlerBusiness.update(
        {
          businessName: req.body.businessName,
          phoneNumber: req.body.phoneNumber,
          email: req.body.email,
          issueDate: funcHelpers.fixEmptyValue(req.body.issueDate),
          expiryDate: funcHelpers.fixEmptyValue(req.body.expiryDate),
          policeVSC: req.body.policeVSC,
          photoID: req.body.photoID,
          sitePlan: req.body.sitePlan,
          zoningClearance: req.body.zoningClearance,
          itemsForSale: req.body.itemsForSale,
          notes: req.body.notes,
        },
        {
          where: {
            hawkerPeddlerBusinessID: req.params.id,
          },
        }
      )
        .then(() => {
          HawkerPeddlerBusinessAddress.update(
            {
              streetNumber: req.body.streetNumber,
              streetName: req.body.streetName,
              town: req.body.town,
              postalCode: req.body.postalCode,
            },
            {
              where: {
                hawkerPeddlerBusinessID: req.params.id,
              },
            }
          );
        })
        .then(() => {
          return res.redirect("/hawkerPeddler");
        })
        .catch((err) => {
          return res.render("hawkerPeddler/editBusiness", {
            title: "BWG | Edit Business",
            message: "Page Error!",
          });
        });
    }
  }
);

module.exports = router;
