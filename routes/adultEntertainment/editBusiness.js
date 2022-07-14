var express = require("express");
var router = express.Router();
// models.
const Dropdown = require("../../models/dropdownManager/dropdown");
const Business = require("../../models/adultEntertainment/business");
const BusinessAddress = require("../../models/adultEntertainment/businessAddress");
// express-validate.
const { body, param, validationResult } = require("express-validator");

/* GET /adultEntertainment/editBusiness page. */
router.get(
  "/:id",
  param("id").matches(/^\d+$/).trim(),
  async (req, res, next) => {
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

    // send businessID to session.
    req.session.businessID = req.params.id;

    // used to populate edit form fields.
    Business.findOne({
      where: {
        businessID: req.session.businessID,
      },
      include: [
        {
          model: BusinessAddress,
        },
      ],
    })
      .then((results) => {
        return res.render("adultEntertainment/editBusiness", {
          title: "BWG | Edit Business",
          errorMessages: messages,
          email: req.session.email,
          auth: req.session.auth, // authorization.
          dropdownValues: dropdownValues,
          businessInfo: {
            businessName: results.businessName,
            streetNumber: results.businessAddresses[0].streetNumber,
            streetName: results.businessAddresses[0].streetName,
            poBoxAptRR: results.businessAddresses[0].poBoxAptRR,
            postalCode: results.businessAddresses[0].postalCode,
            town: results.businessAddresses[0].town,
            ownerName: results.ownerName,
            contactName: results.contactName,
            contactPhone: results.contactPhone,
            licenseNumber: results.licenseNumber,
            issueDate: results.issueDate,
            expiryDate: results.expiryDate,
            policeVSC: results.policeVSC,
            certificateOfInsurance: results.certificateOfInsurance,
            photoID: results.photoID,
            healthInspection: results.healthInspection,
            zoningClearance: results.zoningClearance,
            feePaid: results.feePaid,
            notes: results.notes,
          },
        });
      })
      .catch((err) => {
        return res.render("adultEntertainment/editBusiness", {
          title: "BWG | Edit Business",
          message: "Page Error!",
        });
      });
  }
);

/* POST /adultEntertainment/editBusiness */
router.post(
  "/:id",
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
      return res.render("adultEntertainment/editBusiness", {
        title: "BWG | Edit Business",
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
          town: req.body.town,
          postalCode: req.body.postalCode,
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
      // handle empty dates seperately because express-validate sucks.
    } else if (!req.body.issueDate || !req.body.expiryDate) {
      return res.render("adultEntertainment/editBusiness", {
        title: "BWG | Edit Business",
        message: "Invalid Issue/Expiry Date!",
        email: req.session.email,
        auth: req.session.auth, // authorization.
        dropdownValues: dropdownValues,
        // if the form submission is unsuccessful, save their values.
        formData: {
          businessName: req.body.businessName,
          streetNumber: req.body.streetNumber,
          streetName: req.body.streetName,
          poBoxAptRR: req.body.poBoxAptRR,
          town: req.body.town,
          postalCode: req.body.postalCode,
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
      //   // create business
      //   Business.update(
      //     {
      //       businessName: req.body.businessName,
      //       ownerName: req.body.ownerName,
      //       contactName: req.body.contactName,
      //       contactPhone: req.body.contactPhone,
      //       licenseNumber: req.body.licenseNumber,
      //       issueDate: req.body.issueDate,
      //       expiryDate: req.body.expiryDate,
      //       policeVSC: req.body.policeVSC,
      //       certificateOfInsurance: req.body.certificateOfInsurance,
      //       photoID: req.body.photoID,
      //       healthInspection: req.body.healthInspection,
      //       zoningClearance: req.body.zoningClearance,
      //       feePaid: req.body.feePaid,
      //       notes: req.body.notes,
      //       businessAddresses: [
      //         {
      //           streetNumber: req.body.streetNumber,
      //           streetName: req.body.streetName,
      //           poBoxAptRR: req.body.poBoxAptRR,
      //           town: req.body.town,
      //           postalCode: req.body.postalCode,
      //         },
      //       ],
      //     },
      //     {
      //       include: [BusinessAddress],
      //     }
      //   )
      Business.update(
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
          notes: req.body.notes,
        },
        {
          where: {
            businessID: req.session.businessID,
          },
        }
      )
        .then((result) => {
          BusinessAddress.update(
            {
              streetNumber: req.body.streetNumber,
              streetName: req.body.streetName,
              poBoxAptRR: req.body.poBoxAptRR,
              town: req.body.town,
              postalCode: req.body.postalCode,
            },
            {
              where: {
                businessID: req.session.businessID,
              },
            }
          );
        })
        // redirect back to /adultEntertainment.
        .then(res.redirect("/adultEntertainment"))
        .catch((err) => {
          return res.render("adultEntertainment/editBusiness", {
            title: "BWG | Edit Business",
            message: "Page Error!",
          });
        });
    }
  }
);

module.exports = router;
