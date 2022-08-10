var express = require("express");
var router = express.Router();
// models.
const Dropdown = require("../../models/dropdownManager/dropdown");
const LiquorBusiness = require("../../models/liquor/liquorBusiness");
const LiquorBusinessAddress = require("../../models/liquor/liquorBusinessAddress");
// helper.
const funcHelpers = require("../../config/funcHelpers");
// express-validate.
const { body, validationResult } = require("express-validator");

/* GET /liquor/addBusiness */
router.get("/", async (req, res, next) => {
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

  return res.render("liquor/addBusiness", {
    title: "BWG | Add Business",
    message: messages,
    email: req.session.email,
    auth: req.session.auth, // authorization.
    streets: streets,
  });
});

/* POST /liquor/addBusiness */
router.post(
  "/",
  body("businessName")
    .if(body("businessName").notEmpty())
    .matches(/^[^%<>^$\/\\;!{}?]+$/)
    .withMessage("Invalid Business Name Entry!")
    .trim(),
  body("businessPhone")
    .if(body("businessPhone").notEmpty())
    .matches(/^[^%<>^$\/\\;!{}?]+$/)
    .withMessage("Invalid Business Phone Number Entry!")
    .trim(),
  body("contactName")
    .if(body("contactName").notEmpty())
    .matches(/^[^%<>^$\/\\;!{}?]+$/)
    .withMessage("Invalid Contact Name Entry!")
    .trim(),
  body("contactPhone")
    .if(body("contactPhone").notEmpty())
    .matches(/^[^%<>^$\/\\;!{}?]+$/)
    .withMessage("Invalid Contact Phone Number Entry!")
    .trim(),
  body("streetNumber")
    .if(body("streetNumber").notEmpty())
    .matches(/^[^%<>^$\/\\;!{}?]+$/)
    .withMessage("Invalid Street Number Entry!")
    .trim(),
  body("streetName")
    .if(body("streetName").notEmpty())
    .matches(/^[^%<>^$\/\\;!{}?]+$/)
    .withMessage("Invalid Street Name Entry!")
    .trim(),
  body("town")
    .if(body("town").notEmpty())
    .matches(/^[^%<>^$\/\\;!{}?]+$/)
    .withMessage("Invalid Town Entry!")
    .trim(),
  body("postalCode")
    .if(body("postalCode").notEmpty())
    .matches(/^[^%<>^$\/\\;!{}?]+$/)
    .withMessage("Invalid Postal Code Entry!")
    .trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // use built-in array() to convert Result object to array for custom error messages.
    var errorArray = errors.array();

    // get dropdown values.
    var streets = await Dropdown.findAll({
      where: {
        dropdownFormID: 13, // streets
      },
    });

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("liquor/addBusiness", {
        title: "BWG | Add Business",
        message: errorArray[0].msg, // custom error message. (should indicate which field has the error.)
        email: req.session.email,
        auth: req.session.auth, // authorization.
        streets: streets,
        // if the form submission is unsuccessful, save their values.
        formData: {
          businessName: req.body.businessName,
          businessPhone: req.body.businessPhone,
          streetNumber: req.body.streetNumber,
          streetName: req.body.streetName,
          town: req.body.town,
          postalCode: req.body.postalCode,
          contactName: req.body.contactName,
          contactPhone: req.body.contactPhone,
          dateStarted: req.body.dateStarted,
          applicationType: req.body.applicationType,
          feeReceived: req.body.feeReceived,
          municipalInformationSigned: req.body.municipalInformationSigned,
          municipalInformationSentToAGCO:
            req.body.municipalInformationSentToAGCO,
          fireApprovalReceived: req.body.fireApprovalReceived,
          fireSentToAGCO: req.body.fireSentToAGCO,
          planningApprovalReceived: req.body.planningApprovalReceived,
          planningSentToAGCO: req.body.planningSentToAGCO,
          smdhuApprovalReceived: req.body.smdhuApprovalReceived,
          smdhuSentToAGCO: req.body.smdhuSentToAGCO,
          buildingApprovalReceived: req.body.buildingApprovalReceived,
          buildingSentToAGCO: req.body.buildingSentToAGCO,
          licenseApproved: req.body.licenseApproved,
          notes: req.body.notes,
        },
      });
    } else {
      // create business
      LiquorBusiness.create(
        {
          businessName: req.body.businessName,
          businessPhone: req.body.businessPhone,
          streetNumber: req.body.streetNumber,
          streetName: req.body.streetName,
          town: req.body.town,
          postalCode: req.body.postalCode,
          contactName: req.body.contactName,
          contactPhone: req.body.contactPhone,
          dateStarted: funcHelpers.fixEmptyValue(req.body.dateStarted),
          applicationType: req.body.applicationType,
          feeReceived: req.body.feeReceived,
          municipalInformationSigned: req.body.municipalInformationSigned,
          municipalInformationSentToAGCO:
            req.body.municipalInformationSentToAGCO,
          fireApprovalReceived: req.body.fireApprovalReceived,
          fireSentToAGCO: req.body.fireSentToAGCO,
          planningApprovalReceived: req.body.planningApprovalReceived,
          planningSentToAGCO: req.body.planningSentToAGCO,
          smdhuApprovalReceived: req.body.smdhuApprovalReceived,
          smdhuSentToAGCO: req.body.smdhuSentToAGCO,
          buildingApprovalReceived: req.body.buildingApprovalReceived,
          buildingSentToAGCO: req.body.buildingSentToAGCO,
          licenseApproved: req.body.licenseApproved,
          notes: req.body.notes,
          liquorBusinessAddresses: [
            {
              streetNumber: req.body.streetNumber,
              streetName: req.body.streetName,
              town: req.body.town,
              postalCode: req.body.postalCode,
            },
          ],
        },
        {
          include: [LiquorBusinessAddress],
        }
      )
        .then(() => {
          return res.redirect("/liquor");
        })
        .catch((err) => {
          return res.render("liquor/addBusiness", {
            title: "BWG | Add Business",
            message: "Page Error!",
          });
        });
    }
  }
);

module.exports = router;
