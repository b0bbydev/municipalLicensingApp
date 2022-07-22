var express = require("express");
var router = express.Router();
// models.
const Dropdown = require("../../models/dropdownManager/dropdown");
const HawkerPeddlerBusiness = require("../../models/hawkerPeddler/hawkerPeddlerBusiness");
const HawkerPeddlerBusinessAddress = require("../../models/hawkerPeddler/hawkerPeddlerBusinessAddress");
// express-validate.
const { body, validationResult } = require("express-validator");

/* GET /hawkerPeddler/addBusiness/:id page. */
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

  return res.render("hawkerPeddler/addBusiness", {
    title: "BWG | Add Business",
    errorMessages: messages,
    email: req.session.email,
    auth: req.session.auth, // authorization.
    dropdownValues: dropdownValues,
  });
});

/* POST /hawkerPeddler/addBusiness/:id */
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
      return res.render("hawkerPeddler/addBusiness", {
        title: "BWG | Add Business",
        message: errorArray[0].msg, // custom error message. (should indicate which field has the error.)
        email: req.session.email,
        auth: req.session.auth, // authorization.
        dropdownValues: dropdownValues,
        // if the form submission is unsuccessful, save their values.
        formData: {
          businessName: req.body.businessName,
        },
      });
    } else {
      // create business
      HawkerPeddlerBusiness.create(
        {
          businessName: req.body.businessName,
          phoneNumber: req.body.phoneNumber,
          email: req.body.email,
          itemsForSale: req.body.itemsForSale,
          hawkerPeddlerPropertyID: req.session.hawkerPeddlerPropertyID,
          hawkerPeddlerBusinessAddresses: [
            {
              streetNumber: req.body.streetNumber,
              streetName: req.body.streetName,
              town: req.body.town,
              postalCode: req.body.postalCode,
            },
          ],
        },
        {
          include: [HawkerPeddlerBusinessAddress],
        }
      )
        .then(() => {
          return res.redirect(
            "/hawkerPeddler/businesses/" + req.session.hawkerPeddlerPropertyID
          );
        })
        .catch((err) => {
          return res.render("hawkerPeddler/addBusiness", {
            title: "BWG | Add Business",
            message: "Page Error!" + err,
          });
        });
    }
  }
);

module.exports = router;
