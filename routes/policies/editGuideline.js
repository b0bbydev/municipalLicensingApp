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

      Guideline.findOne({
        where: {
          guidelineID: req.params.id, // guidelineID is passed into URL.
        },
      }).then((results) => {
        return res.render("policies/editGuideline", {
          title: "BWG | Edit Guideline",
          errorMessages: messages,
          email: req.session.email,
          auth: req.session.auth, // authorization.
          statusDropdownValues: statusDropdownValues,
          // if the form submission is unsuccessful, save their values.
          guidelineInfo: {
            guidelineName: results.guidelineName,
            dateApproved: results.dateApproved,
            lastReviewDate: results.lastReviewDate,
            scheduledReviewDate: results.scheduledReviewDate,
            dateAmended: results.dateAmended,
            status: results.status,
            category: results.category,
            notes: results.notes,
          },
        });
      });
    }
  }
);

/* POST /policies/editGuideline/:id */
router.post(
  "/:id",
  param("id").matches(/^\d+$/).trim(),
  body("guidelineName")
    .if(body("guidelineName").notEmpty())
    .matches(/^[a-zA-Z0-9\/\-,. ]*$/)
    .withMessage("Invalid Guideline Name Entry!")
    .trim(),
  body("dateApproved")
    .if(body("dateApproved").notEmpty())
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("Invalid Date Approved Entry!")
    .trim(),
  body("lastReviewDate")
    .if(body("lastReviewDate").notEmpty())
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("Invalid Last Review Date Entry!")
    .trim(),
  body("scheduledReviewDate")
    .if(body("scheduledReviewDate").notEmpty())
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("Invalid Scheduled Review Date Entry!")
    .trim(),
  body("dateAmended")
    .if(body("dateAmended").notEmpty())
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("Invalid Date Amended Entry!")
    .trim(),
  body("status")
    .if(body("status").notEmpty())
    .matches(/^[a-zA-Z\/\- ]*$/)
    .withMessage("Invalid Status Entry!")
    .trim(),
  body("category")
    .if(body("category").notEmpty())
    .matches(/^[a-zA-Z0-9\/\-,. ]*$/)
    .withMessage("Invalid Category Entry!")
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

    // if errors is NOT empty (if there are errors...).
    if (!errors.isEmpty()) {
      return res.render("policies/editGuideline", {
        title: "BWG | Edit Guideline",
        message: errorArray[0].msg,
        email: req.session.email,
        auth: req.session.auth, // authorization.
        // if the form submission is unsuccessful, save their values.
        formData: {
          guidelineName: req.body.guidelineName,
          dateApproved: req.body.dateApproved,
          lastReviewDate: req.body.lastReviewDate,
          scheduledReviewDate: req.body.scheduledReviewDate,
          dateAmended: req.body.dateAmended,
          status: req.body.status,
          category: req.body.category,
          notes: req.body.notes,
        },
      });
    } else {
      // db stuff.
      Guideline.update(
        {
          guidelineName: req.body.guidelineName,
          dateApproved: funcHelpers.fixEmptyValue(req.body.dateApproved),
          lastReviewDate: funcHelpers.fixEmptyValue(req.body.lastReviewDate),
          scheduledReviewDate: funcHelpers.fixEmptyValue(
            req.body.scheduledReviewDate
          ),
          dateAmended: funcHelpers.fixEmptyValue(req.body.dateAmended),
          status: req.body.status,
          category: req.body.category,
          notes: req.body.notes,
        },
        {
          where: {
            guidelineID: req.params.id,
          },
        }
      )
        .then(res.redirect("/policies"))
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
