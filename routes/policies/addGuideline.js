var express = require("express");
var router = express.Router();
// models.
const Dropdown = require("../../models/dropdownManager/dropdown");
const Guideline = require("../../models/policies/guideline");
// helpers.
const funcHelpers = require("../../config/funcHelpers");
// express-validate.
const { body, param, validationResult } = require("express-validator");

/* GET home page. */
router.get(
  "/:id",
  param("id").matches(/^\d+$/).trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...).
    if (!errors.isEmpty()) {
      return res.render("policies/addGuideline", {
        title: "BWG | Add Guideline",
        message: "Page Error!",
        email: req.session.email,
        auth: req.session.auth, // authorization.
      });
    } else {
      // check if there's an error message in the session
      let messages = req.session.messages || [];
      // clear session messages
      req.session.messages = [];

      // status options.
      var statusDropdownValues = await Dropdown.findAll({
        where: {
          dropdownFormID: 12,
          dropdownTitle: "Status Options",
        },
      });

      return res.render("policies/addGuideline", {
        title: "BWG | Add Guideline",
        message: messages,
        email: req.session.email,
        auth: req.session.auth, // authorization.
        statusDropdownValues: statusDropdownValues,
      });
    }
  }
);

/* POST /addGuideline */
router.post(
  "/:id",
  param("id").matches(/^\d+$/).trim(),
  body("guidelineName")
    .if(body("guidelineName").notEmpty())
    .matches(/^[^%<>^$\/\\;!{}?]+$/)
    .withMessage("Invalid Guideline Name Entry!")
    .trim(),
  body("status")
    .if(body("status").notEmpty())
    .matches(/^[^%<>^$\/\\;!{}?]+$/)
    .withMessage("Invalid Status Entry!")
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
      return res.render("policies/addGuideline", {
        title: "BWG | Add Guideline",
        message: errorArray[0].msg,
        email: req.session.email,
        auth: req.session.auth, // authorization.
        statusDropdownValues: statusDropdownValues,
        // if the form submission is unsuccessful, save their values.
        formData: {
          guidelineName: req.body.guidelineName,
          status: req.body.status,
          dateApproved: req.body.dateApproved,
          dateAmended: req.body.dateAmended,
          lastReviewDate: req.body.lastReviewDate,
          scheduledReviewDate: req.body.scheduledReviewDate,
          notes: req.body.notes,
        },
      });
    } else {
      // db stuff.
      Guideline.create({
        guidelineName: req.body.guidelineName,
        status: req.body.status,
        dateApproved: funcHelpers.fixEmptyValue(req.body.dateApproved),
        dateAmended: funcHelpers.fixEmptyValue(req.body.dateAmended),
        lastReviewDate: funcHelpers.fixEmptyValue(req.body.lastReviewDate),
        scheduledReviewDate: funcHelpers.fixEmptyValue(
          req.body.scheduledReviewDate
        ),
        notes: req.body.notes,
        policyID: req.session.policyID,
      })
        // redirect back to the policy they were viewing.
        .then(() => {
          return res.redirect("/policies");
        })
        .catch((err) => {
          return res.render("policies/addGuideline", {
            title: "BWG | Add Guideline",
            message: "Page Error!",
          });
        });
    }
  }
);

module.exports = router;
