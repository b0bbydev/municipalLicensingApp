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
const { body, param, validationResult } = require("express-validator");

/* GET /poaMatters/editPoaMatter/:id */
router.get(
  "/:id",
  param("id").matches(/^\d+$/).trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...),
    if (!errors.isEmpty()) {
      return res.render("poaMatters/editPoaMatter", {
        title: "BWG | Edit POA Matter",
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
      // get officer names.
      var officerNames = await Dropdown.findAll({
        where: {
          dropdownFormID: 27, // officer names
        },
      });
      // get verdict options.
      var verdictOptions = await Dropdown.findAll({
        where: {
          dropdownFormID: 31,
        },
      });

      POAMatter.findOne({
        where: {
          poaMatterID: req.params.id,
        },
        include: [
          {
            model: POAMatterLocation,
          },
        ],
      }).then((results) => {
        return res.render("poaMatters/editPoaMatter", {
          title: "BWG | Edit POA Matter",
          errorMessages: messages,
          email: req.session.email,
          auth: req.session.auth, // authorization.
          streets: streets,
          officerNames: officerNames,
          verdictOptions: verdictOptions,
          // populate input fields with existing values.
          formData: {
            infoNumber: results.infoNumber,
            dateOfOffence: results.dateOfOffence,
            dateClosed: results.dateClosed,
            poaType: results.poaType,
            officerName: results.officerName,
            defendantName: results.defendantName,
            offence: results.offence,
            comment: results.comment,
            prosecutor: results.prosecutor,
            verdict: results.verdict,
            setFine: results.setFine,
            fineAssessed: results.fineAssessed,
            amountPaid: results.amountPaid,
            streetNumber: results.poaMatterLocations[0].streetNumber,
            streetName: results.poaMatterLocations[0].streetName,
            town: results.poaMatterLocations[0].town,
            postalCode: results.poaMatterLocations[0].postalCode,
          },
        });
      });
    }
  }
);

/* POST /poaMatters/editPoaMatter/:id */
router.post(
  "/:id",
  param("id").matches(/^\d+$/).trim(),
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
      return res.render("poaMatters/editPoaMatter", {
        title: "BWG | Edit POA Matter",
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
      POAMatter.update(
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
        },
        {
          where: {
            poaMatterID: req.params.id,
          },
        }
      )
        .then(() => {
          POAMatterLocation.update(
            {
              streetNumber: req.body.streetNumber,
              streetName: req.body.streetName,
              town: req.body.town,
              postalCode: req.body.postalCode,
            },
            {
              where: {
                poaMatterID: req.params.id,
              },
            }
          );
        })
        .then(() => {
          // create array for bulkCreate.
          let trialDates = [
            {
              trialDate: funcHelpers.fixEmptyValue(req.body.trialDateOne),
              poaMatterID: req.params.id,
            },
            {
              trialDate: funcHelpers.fixEmptyValue(req.body.trialDateTwo),
              poaMatterID: req.params.id,
            },
            {
              trialDate: funcHelpers.fixEmptyValue(req.body.trialDateThree),
              poaMatterID: req.params.id,
            },
          ];

          // loops through trialDates and if trialDate is null, delete that whole specific object in the array.
          for (const key in trialDates) {
            if (trialDates[key].trialDate === null) {
              // remove the key/object from the array.
              trialDates.splice([key]);
            }
          }
          // insert the array,
          POAMatterTrial.bulkCreate(trialDates);
        })
        .then(() => {
          return res.redirect("/poaMatters");
        })
        .catch((err) => {
          return res.render("poaMatters/editPoaMatter", {
            title: "BWG | Edit POA Matter",
            message: "Page Error!",
          });
        });
    }
  }
);

module.exports = router;
