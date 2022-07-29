var express = require("express");
var router = express.Router();
// models.
const Dropdown = require("../../models/dropdownManager/dropdown");
const POAMatter = require("../../models/poaMatters/poaMatter");
const POAMatterLocation = require("../../models/poaMatters/poaMatterLocation");
const POAMatterTrial = require("../../models/poaMatters/poaMatterTrial");
// helpers.
const funcHelpers = require("../../config/funcHelpers");
// express-validate.
const { body, validationResult } = require("express-validator");

/* GET /poaMatters/addPoaMatter */
router.get("/", async (req, res, next) => {
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
  var officerNames = await Dropdown.findAll({
    where: {
      dropdownFormID: 27, // officer names
    },
  });

  return res.render("poaMatters/addPoaMatter", {
    title: "BWG | Add POA Matter",
    errorMessages: messages,
    email: req.session.email,
    auth: req.session.auth, // authorization.
    streets: streets,
    officerNames: officerNames,
  });
});

/* POST /poaMatters/addPoaMatter */
router.post(
  "/",
  body("infoNumber")
    .if(body("infoNumber").notEmpty())
    .matches(/^[ a-zA-Z0-9\'-]*$/)
    .withMessage("Invalid Info Number Entry!")
    .trim(),
  body("officerName")
    .if(body("officerName").notEmpty())
    .matches(/^[ a-zA-Z0-9\'-]*$/)
    .withMessage("Invalid Officer Name Entry!")
    .trim(),
  body("defendantName")
    .if(body("defendantName").notEmpty())
    .matches(/^[ a-zA-Z0-9\'-]*$/)
    .withMessage("Invalid Defendant Name Entry!")
    .trim(),
  body("poaType")
    .if(body("poaType").notEmpty())
    .matches(/^[ a-zA-Z0-9\'-]*$/)
    .withMessage("Invalid POA Type Entry!")
    .trim(),
  body("offence")
    .if(body("offence").notEmpty())
    .matches(/^[\r\na-zA-Z0-9\/\-,.:"' ]+/)
    .withMessage("Invalid Offence Entry!")
    .trim(),
  body("prosecutor")
    .if(body("prosecutor").notEmpty())
    .matches(/^[ a-zA-Z0-9\'-]*$/)
    .withMessage("Invalid Prosecutor Entry!")
    .trim(),
  body("verdict")
    .if(body("verdict").notEmpty())
    .matches(/^[ a-zA-Z0-9\'-]*$/)
    .withMessage("Invalid Verdict Entry!")
    .trim(),
  body("comment")
    .if(body("comment").notEmpty())
    .matches(/^[\r\na-zA-Z0-9\/\-,.:"' ]+/)
    .withMessage("Invalid Comment Entry!")
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

    // get dropdown values.
    var streets = await Dropdown.findAll({
      where: {
        dropdownFormID: 13, // streets
      },
    });
    var officerNames = await Dropdown.findAll({
      where: {
        dropdownFormID: 27, // officer names
      },
    });

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("poaMatters/addPoaMatter", {
        title: "BWG | Add POA Matter",
        message: errorArray[0].msg, // custom error message. (should indicate which field has the error.)
        email: req.session.email,
        auth: req.session.auth, // authorization.
        streets: streets,
        officerNames: officerNames,
        // if the form submission is unsuccessful, save their values.
        formData: {
          infoNumber: req.body.infoNumber,
          dateOfOffence: req.body.dateOfOffence,
          dateClosed: req.body.dateClosed,
          poaType: req.body.poaType,
          officerName: req.body.officerName,
          defendantName: req.body.defendantName,
          offence: req.body.offence,
          comment: req.body.comment,
          prosecutor: req.body.prosecutor,
          verdict: req.body.verdict,
          setFine: req.body.setFine,
          fineAssessed: req.body.fineAssessed,
          amountPaid: req.body.amountPaid,
          streetNumber: req.body.streetNumber,
          streetName: req.body.streetName,
          town: req.body.town,
          postalCode: req.body.postalCode,
        },
      });
    } else {
      POAMatter.create(
        {
          infoNumber: req.body.infoNumber,
          dateOfOffence: funcHelpers.fixEmptyValue(req.body.dateOfOffence),
          dateClosed: funcHelpers.fixEmptyValue(req.body.dateClosed),
          poaType: req.body.poaType,
          officerName: req.body.officerName,
          defendantName: req.body.defendantName,
          offence: req.body.offence,
          comment: req.body.comment,
          prosecutor: req.body.prosecutor,
          verdict: req.body.verdict,
          setFine: funcHelpers.fixEmptyValue(req.body.setFine),
          fineAssessed: funcHelpers.fixEmptyValue(req.body.fineAssessed),
          amountPaid: funcHelpers.fixEmptyValue(req.body.amountPaid),
          poaMatterLocations: [
            {
              streetNumber: req.body.streetNumber,
              streetName: req.body.streetName,
              town: req.body.town,
              postalCode: req.body.postalCode,
            },
          ],
        },
        {
          include: [POAMatterLocation],
        }
      )
        // results because we need to get the poaMatter ID to relate the rows.
        .then((results) => {
          // create array for bulkCreate.
          let trialDates = [
            {
              trialDate: req.body.trialDateOne,
              poaMatterID: results.poaMatterID,
            },
            {
              trialDate: req.body.trialDateTwo,
              poaMatterID: results.poaMatterID,
            },
            {
              trialDate: req.body.trialDateThree,
              poaMatterID: results.poaMatterID,
            },
          ];
          POAMatterTrial.bulkCreate(trialDates);
        })
        .then(() => {
          return res.redirect("/poaMatters");
        })
        .catch((err) => {
          return res.render("poaMatters/addPoaMatter", {
            title: "BWG | Add POA Matter",
            message: "Page Error!",
          });
        });
    }
  }
);

module.exports = router;
