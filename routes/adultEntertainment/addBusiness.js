var express = require("express");
var router = express.Router();
// models.
const Dropdown = require("../../models/dropdownManager/dropdown");
const Business = require("../../models/adultEntertainment/business");
const BusinessAddress = require("../../models/adultEntertainment/businessAddress");
// express-validate.
const { body, validationResult } = require("express-validator");

/* GET /adultEntertainment/addBusiness page. */
router.get("/", async (req, res, next) => {
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

  return res.render("adultEntertainment/addBusiness", {
    title: "BWG | Add Business",
    errorMessages: messages,
    email: req.session.email,
    auth: req.session.auth, // authorization.
    dropdownValues: dropdownValues,
  });
});

/* POST /adultEntertainment/addBusiness */
router.post(
  "/",
  body("businessName")
    .if(body("businessName").notEmpty())
    .matches(/^[ a-zA-Z\'-]*$/)
    .withMessage("Invalid Business Name Entry!")
    .trim(),
  body("ownerName")
    .if(body("ownerName").notEmpty())
    .matches(/^[ a-zA-Z\'-]*$/)
    .withMessage("Invalid Owner Name Entry!")
    .trim(),
  body("contactPhone")
    .if(body("contactPhone").notEmpty())
    .matches(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/)
    .withMessage("Invalid Contact Phone Number Entry!")
    .trim(),
  body("streetNumber")
    .if(body("streetNumber").notEmpty())
    .matches(/^[0-9. ]*$/)
    .withMessage("Invalid Street Number Entry!")
    .trim(),
  body("streetName")
    .if(body("streetName").notEmpty())
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
        dropdownFormID: 13, // streets
      },
    });

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("adultEntertainment/addBusiness", {
        title: "BWG | Add Business",
        message: errorArray[0].msg, // custom error message. (should indicate which field has the error.)
        email: req.session.email,
        auth: req.session.auth, // authorization.
        dropdownValues: dropdownValues,
        // if the form submission is unsuccessful, save their values.
        formData: {
          businessName: req.body.businessName,
          streetNumber: req.body.streetNumber,
          streetName: req.body.streetName,
          poBoxAptRR: req.body.poBoxAptRR,
          ownerName: req.body.ownerName,
          contactName: req.body.contactName,
          contactPhone: req.body.contactPhone,
          licenseNumber: req.body.licenseNumber,
          issueDate: req.body.issueDate,
          expiryDate: req.body.expiryDate,
          policeVSC: req.body.policeVSC,
          certificateOfInsurance: req.body.certificateOfInsurance,
          photoID: req.body.photoID,
          healthInspection: req.body.healthInspection,
          zoningClearance: req.body.zoningClearance,
          feePaid: req.body.feePaid,
          notes: req.body.notes,
        },
      });
    } else {
      // create business
      Business.create(
        {
          businessName: req.body.businessName,
          ownerName: req.body.ownerName,
          contactName: req.body.contactName,
          contactPhone: req.body.contactPhone,
          licenseNumber: req.body.licenseNumber,
          issueDate: req.body.issueDate,
          expiryDate: req.body.expiryDate,
          policeVSC: req.body.policeVSC,
          certificateOfInsurance: req.body.certificateOfInsurance,
          photoID: req.body.photoID,
          healthInspection: req.body.healthInspection,
          zoningClearance: req.body.zoningClearance,
          feePaid: req.body.feePaid,
          businessAddresses: [
            {
              streetNumber: req.body.streetNumber,
              streetName: req.body.streetName,
              poBoxAptRR: req.body.poBoxAptRR,
              town: req.body.town,
              postalCode: req.body.postalCode,
            },
          ],
        },
        {
          include: BusinessAddress,
        }
      )
        .then(res.redirect("/adultEntertainment"))
        .catch((err) => {
          return res.render("adultEntertainment/addBusiness", {
            title: "BWG | Add Business",
            message: "Page Error!",
          });
        });
    }
  }
);

module.exports = router;
