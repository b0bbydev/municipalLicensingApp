var express = require("express");
var router = express.Router();
// models.
const Dropdown = require("../../models/dropdownManager/dropdown");
const Guideline = require("../../models/policies/guideline");
// helpers.
const funcHelpers = require("../../config/funcHelpers");
// express-validate.
const { param, body, validationResult } = require("express-validator");

/* GET /policies/editGuideline/:id */
router.get(
  "/:id",
  param("id").matches(/^\d+$/).trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...).
    if (!errors.isEmpty()) {
      return res.render("policies/editGuideline", {
        title: "BWG | Edit Guideline",
        message: "Page Error!",
        auth: req.session.auth, // authorization.
      });
    } else {
      // check if there's an error message in the session.
      let messages = req.session.messages || [];
      // clear session messages.
      req.session.messages = [];

      // status options.
      var statusDropdownValues = await Dropdown.findAll({
        where: {
          dropdownFormID: 12,
          dropdownTitle: "Status Options",
        },
      });
      // authority options.
      var authorityDropdownValues = await Dropdown.findAll({
        where: {
          dropdownFormID: 12,
          dropdownTitle: "Authority Options",
        },
      });

      // for populating input fields with existing values.
      Guideline.findOne({
        where: {
          guidelineID: req.params.id, // guidelineID is passed into URL.
        },
      })
        .then((results) => {
          return res.render("policies/editGuideline", {
            title: "BWG | Edit Guideline",
            message: messages,
            email: req.session.email,
            auth: req.session.auth, // authorization.
            statusDropdownValues: statusDropdownValues,
            authorityDropdownValues: authorityDropdownValues,
            // if the form submission is unsuccessful, save their values.
            formData: {
              guidelineNumber: results.guidelineNumber,
              guidelineName: results.guidelineName,
              status: results.status,
              dateApproved: results.dateApproved,
              dateAmended: results.dateAmended,
              lastReviewDate: results.lastReviewDate,
              scheduledReviewDate: results.scheduledReviewDate,
              category: results.category,
              division: results.division,
              authority: results.authority,
              administrator: results.administrator,
              fileHoldURL: results.fileHoldURL,
              legislationRequired: results.legislationRequired,
              notes: results.notes,
            },
          });
        })
        .catch((err) => {
          return res.render("policies/editGuideline", {
            title: "BWG | Edit Guideline",
            message: "Page Error!",
          });
        });
    }
  }
);

/* POST /policies/editGuideline/:id */
router.post(
  "/:id",
  param("id").matches(/^\d+$/).trim(),
  body("guidelineNumber")
    .if(body("guidelineNumber").notEmpty())
    .matches(/^[^%<>^$\\;!{}?]+$/)
    .withMessage("Invalid Guideline Number Entry!")
    .trim(),
  body("guidelineName")
    .if(body("guidelineName").notEmpty())
    .matches(/^[^%<>^$\\;!{}?]+$/)
    .withMessage("Invalid Guideline Name Entry!")
    .trim(),
  body("status")
    .if(body("status").notEmpty())
    .matches(/^[^%<>^$\\;!{}?]+$/)
    .withMessage("Invalid Status Entry!")
    .trim(),
  body("division")
    .if(body("division").notEmpty())
    .matches(/^[^%<>^$\\;!{}?]+$/)
    .withMessage("Invalid Division Entry!")
    .trim(),
  body("authority")
    .if(body("authority").notEmpty())
    .matches(/^[^%<>^$\\;!{}?]+$/)
    .withMessage("Invalid Authority Entry!")
    .trim(),
  body("administrator")
    .if(body("administrator").notEmpty())
    .matches(/^[^%<>^$\\;!{}?]+$/)
    .withMessage("Invalid Administrator Entry!")
    .trim(),
  body("notes")
    .if(body("notes").notEmpty())
    .matches(/^[a-zA-Z0-9\/\-, ]*$/)
    .withMessage("Invalid Notes Entry!")
    .trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // use built-in array() to convert Result object to array for custom error messages.
    var errorArray = errors.array();

    // status options.
    var statusDropdownValues = await Dropdown.findAll({
      where: {
        dropdownFormID: 12,
        dropdownTitle: "Status Options",
      },
    });

    // if errors is NOT empty (if there are errors...).
    if (!errors.isEmpty()) {
      return res.render("policies/editGuideline", {
        title: "BWG | Edit Guideline",
        message: errorArray[0].msg,
        email: req.session.email,
        auth: req.session.auth, // authorization.
        statusDropdownValues: statusDropdownValues,
        // if the form submission is unsuccessful, save their values.
        formData: {
          guidelineNumber: req.body.guidelineNumber,
          guidelineName: req.body.guidelineName,
          status: req.body.status,
          dateApproved: req.body.dateApproved,
          dateAmended: req.body.dateAmended,
          lastReviewDate: req.body.lastReviewDate,
          scheduledReviewDate: req.body.scheduledReviewDate,
          category: req.body.category,
          division: req.body.division,
          authority: req.body.authority,
          administrator: req.body.administrator,
          legislationRequired: req.body.legislationRequired,
          fileHoldURL: req.body.fileHoldURL,
          notes: req.body.notes,
        },
      });
    } else {
      // db stuff.
      Guideline.update(
        {
          guidelineNumber: req.body.guidelineNumber,
          guidelineName: req.body.guidelineName,
          status: req.body.status,
          dateApproved: funcHelpers.fixEmptyValue(req.body.dateApproved),
          dateAmended: funcHelpers.fixEmptyValue(req.body.dateAmended),
          lastReviewDate: funcHelpers.fixEmptyValue(req.body.lastReviewDate),
          scheduledReviewDate: funcHelpers.fixEmptyValue(
            req.body.scheduledReviewDate
          ),
          category: req.body.category,
          division: req.body.division,
          authority: req.body.authority,
          administrator: req.body.administrator,
          fileHoldURL: req.body.fileHoldURL,
          legislationRequired: req.body.legislationRequired,
          notes: req.body.notes,
        },
        {
          where: {
            guidelineID: req.params.id,
          },
        }
      )
        .then(() => {
          return res.redirect("/policies");
        })
        .catch((err) => {
          return res.render("policies/editGuideline", {
            title: "BWG | Edit Guideline",
            message: "Page Error!",
          });
        });
    }
  }
);

module.exports = router;
