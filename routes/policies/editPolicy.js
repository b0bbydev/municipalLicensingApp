var express = require("express");
var router = express.Router();
// models.
const Dropdown = require("../../models/dropdownManager/dropdown");
const Policy = require("../../models/policies/policy");
// helpers.
const funcHelpers = require("../../config/funcHelpers");
// express-validate.
const { param, body, validationResult } = require("express-validator");

/* GET /policies/editPolicy/:id */
router.get(
  "/:id",
  param("id").matches(/^\d+$/).trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...).
    if (!errors.isEmpty()) {
      return res.render("policies/editPolicy", {
        title: "BWG | Edit Policy",
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
      // category options.
      var categoryDropdownValues = await Dropdown.findAll({
        where: {
          dropdownFormID: 12,
          dropdownTitle: "Category Options",
        },
      });
      // authority options.
      var authorityDropdownValues = await Dropdown.findAll({
        where: {
          dropdownFormID: 12,
          dropdownTitle: "Authority Options",
        },
      });

      Policy.findOne({
        where: {
          policyID: req.params.id,
        },
      })
        .then((results) => {
          return res.render("policies/editPolicy", {
            title: "BWG | Edit Policy",
            message: messages,
            email: req.session.email,
            auth: req.session.auth, // authorization.
            statusDropdownValues: statusDropdownValues,
            categoryDropdownValues: categoryDropdownValues,
            authorityDropdownValues: authorityDropdownValues,
            // populate input fields with existing values.
            policyInfo: {
              policyNumber: results.policyNumber,
              policyName: results.policyName,
              cowDate: results.cowDate,
              councilResolution: results.councilResolution,
              dateApproved: results.dateApproved,
              dateAmended: results.dateAmended,
              dateEffective: results.dateEffective,
              category: results.category,
              lastReviewDate: results.lastReviewDate,
              scheduledReviewDate: results.scheduledReviewDate,
              division: results.division,
              authority: results.authority,
              administrator: results.administrator,
              legislationRequired: results.legislationRequired,
              status: results.status,
              fileHoldURL: results.fileHoldURL,
              notes: results.notes,
            },
          });
        })
        .catch((err) => {
          return res.render("policies/editPolicy", {
            title: "BWG | Edit Policy",
            message: "Page Error!",
          });
        });
    }
  }
);

/* POST /policies/editPolicy/:id */
router.post(
  "/:id",
  param("id").matches(/^\d+$/).trim(),
  body("policyNumber")
    .if(body("policyNumber").notEmpty())
    .matches(/^[^%<>^$\\;!{}?]+$/)
    .withMessage("Invalid Policy Number Entry!")
    .trim(),
  body("policyName")
    .if(body("policyName").notEmpty())
    .matches(/^[^%<>^$\\;!{}?]+$/)
    .withMessage("Invalid Policy Name Entry!")
    .trim(),
  body("councilResolution")
    .if(body("councilResolution").notEmpty())
    .matches(/^[^%<>^$\\;!{}?]+$/)
    .withMessage("Invalid Council Resolution Entry!")
    .trim(),
  body("category")
    .if(body("category").notEmpty())
    .matches(/^[^%<>^$\\;!{}?]+$/)
    .withMessage("Invalid Category Entry!")
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
  body("status")
    .if(body("status").notEmpty())
    .matches(/^[^%<>^$\\;!{}?]+$/)
    .withMessage("Invalid Status Entry!")
    .trim(),
  body("notes")
    .if(body("notes").notEmpty())
    .matches(/^[^%<>^\/\\;!{}?]+$/)
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
    // category options.
    var categoryDropdownValues = await Dropdown.findAll({
      where: {
        dropdownFormID: 12,
        dropdownTitle: "Category Options",
      },
    });
    // authority options.
    var authorityDropdownValues = await Dropdown.findAll({
      where: {
        dropdownFormID: 12,
        dropdownTitle: "Authority Options",
      },
    });

    // if errors is NOT empty (if there are errors...).
    if (!errors.isEmpty()) {
      return res.render("policies/editPolicy", {
        title: "BWG | Edit Policy",
        message: errorArray[0].msg,
        email: req.session.email,
        auth: req.session.auth, // authorization.
        statusDropdownValues: statusDropdownValues,
        categoryDropdownValues: categoryDropdownValues,
        authorityDropdownValues: authorityDropdownValues,
        // if the form submission is unsuccessful, save their values.
        formData: {
          policyNumber: req.body.policyNumber,
          policyName: req.body.policyName,
          cowDate: req.body.cowDate,
          councilResolution: req.body.councilResolution,
          dateApproved: req.body.dateApproved,
          dateAmended: req.body.dateAmended,
          dateEffective: req.body.dateEffective,
          category: req.body.category,
          lastReviewDate: req.body.lastReviewDate,
          scheduledReviewDate: req.body.scheduledReviewDate,
          division: req.body.division,
          authority: req.body.authority,
          administrator: req.body.administrator,
          legislationRequired: req.body.legislationRequired,
          status: req.body.status,
          fileHoldURL: req.body.fileHoldURL,
          notes: req.body.notes,
        },
      });
    } else {
      // db stuff.
      Policy.update(
        {
          policyNumber: req.body.policyNumber,
          policyName: req.body.policyName,
          cowDate: funcHelpers.fixEmptyValue(req.body.cowDate),
          councilResolution: req.body.councilResolution,
          dateApproved: funcHelpers.fixEmptyValue(req.body.dateApproved),
          dateAmended: funcHelpers.fixEmptyValue(req.body.dateAmended),
          dateEffective: funcHelpers.fixEmptyValue(req.body.dateEffective),
          category: req.body.category,
          lastReviewDate: funcHelpers.fixEmptyValue(req.body.lastReviewDate),
          scheduledReviewDate: funcHelpers.fixEmptyValue(
            req.body.scheduledReviewDate
          ),
          division: req.body.division,
          authority: req.body.authority,
          administrator: req.body.administrator,
          legislationRequired: req.body.legislationRequired,
          status: req.body.status,
          fileHoldURL: req.body.fileHoldURL,
          notes: req.body.notes,
        },
        {
          where: {
            policyID: req.params.id, // leave as params.
          },
        }
      )
        // redirect back to policies.
        .then(() => {
          return res.redirect("/policies");
        })
        .catch((err) => {
          return res.render("policies/editPolicy", {
            title: "BWG | Edit Policy",
            message: "Page Error!",
          });
        });
    }
  }
);

module.exports = router;
