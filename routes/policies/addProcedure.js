var express = require("express");
var router = express.Router();
// models.
const Dropdown = require("../../models/dropdownManager/dropdown");
const Procedure = require("../../models/policies/procedure");
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
      return res.render("policies/addProcedure", {
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

      // dropdown values.
      // status options.
      var statusDropdownValues = await Dropdown.findAll({
        where: {
          dropdownFormID: 12,
          dropdownTitle: "Status Options",
        },
      });

      return res.render("policies/addProcedure", {
        title: "BWG | Add Guideline",
        errorMessages: messages,
        email: req.session.email,
        auth: req.session.auth, // authorization.
        statusDropdownValues: statusDropdownValues,
      });
    }
  }
);

/* POST /addProcedure */
router.post(
  "/:id",
  body("procedureName")
    .if(body("procedureName").notEmpty())
    .matches(/^[a-zA-Z0-9\/\-,. ]*$/)
    .withMessage("Invalid Procedure Name Entry!")
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

    // dropdown values.
    // status options.
    var statusDropdownValues = await Dropdown.findAll({
      where: {
        dropdownFormID: 12,
        dropdownTitle: "Status Options",
      },
    });

    // if errors is NOT empty (if there are errors...).
    if (!errors.isEmpty()) {
      return res.render("policies/addProcedure", {
        title: "BWG | Add Procedure",
        message: errorArray[0].msg,
        email: req.session.email,
        auth: req.session.auth, // authorization.
        statusDropdownValues: statusDropdownValues,
        // if the form submission is unsuccessful, save their values.
        formData: {
          procedureName: req.body.procedureName,
          status: req.body.status,
          dateApproved: req.body.dateApproved,
          dateAmended: req.body.dateAmended,
          lastReviewDate: req.body.lastReviewDate,
          scheduledReviewDate: req.body.scheduledReviewDate,
          category: req.body.category,
          notes: req.body.notes,
        },
      });
    } else {
      // db stuff.
      Procedure.create({
        procedureName: req.body.procedureName,
        status: req.body.status,
        dateApproved: funcHelpers.fixEmptyValue(req.body.dateApproved),
        dateAmended: funcHelpers.fixEmptyValue(req.body.dateAmended),
        lastReviewDate: funcHelpers.fixEmptyValue(req.body.lastReviewDate),
        scheduledReviewDate: funcHelpers.fixEmptyValue(
          req.body.scheduledReviewDate
        ),
        category: req.body.category,
        notes: req.body.notes,
        policyID: req.session.policyID,
      })
        // redirect back to the policy they were viewing.
        .then(res.redirect("/policies"))
        .catch((err) => {
          return res.render("policies/addProcedure", {
            title: "BWG | Add Procedure",
            message: "Page Error!",
          });
        });
    }
  }
);

module.exports = router;
