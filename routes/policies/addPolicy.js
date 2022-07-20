var express = require("express");
var router = express.Router();
// helpers.
const funcHelpers = require("../../config/funcHelpers");
// models.
const Dropdown = require("../../models/dropdownManager/dropdown");
const Policy = require("../../models/policies/policy");
// express-validate.
const { body, validationResult } = require("express-validator");

/* GET /addPolicy */
router.get("/", async (req, res, next) => {
  // server side validation.
  const errors = validationResult(req);

  // if errors is NOT empty (if there are errors...).
  if (!errors.isEmpty()) {
    return res.render("policies/addPolicy", {
      title: "BWG | Add Policy",
      message: "Page Error!",
      auth: req.session.auth, // authorization.
    });
  } else {
    // check if there's an error message in the session.
    let messages = req.session.messages || [];
    // clear session messages.
    req.session.messages = [];

    // dropdown values.
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

    return res.render("policies/addPolicy", {
      title: "BWG | Add Policy",
      errorMessages: messages,
      email: req.session.email,
      auth: req.session.auth, // authorization.
      statusDropdownValues: statusDropdownValues,
      categoryDropdownValues: categoryDropdownValues,
      authorityDropdownValues: authorityDropdownValues,
    });
  }
});

/* POST /addPolicy */
router.post(
  "/",
  body("policyNumber")
    .if(body("policyNumber").notEmpty())
    .matches(/^[0-9-]*$/)
    .withMessage("Invalid Policy Number Entry!")
    .trim(),
  body("policyName")
    .if(body("policyName").notEmpty())
    .matches(/^[a-zA-Z0-9\/\-,. ]*$/)
    .withMessage("Invalid Policy Name Entry!")
    .trim(),
  body("councilResolution")
    .if(body("councilResolution").notEmpty())
    .matches(/^[a-zA-Z0-9\/\-,. ]*$/)
    .withMessage("Invalid Council Resolution Entry!")
    .trim(),
  body("category")
    .if(body("category").notEmpty())
    .matches(/^[a-zA-Z\/\- ]*$/)
    .withMessage("Invalid Category Entry!")
    .trim(),
  body("division")
    .if(body("division").notEmpty())
    .matches(/^[a-zA-Z0-9\/\-,. ]*$/)
    .withMessage("Invalid Division Entry!")
    .trim(),
  body("authority")
    .if(body("authority").notEmpty())
    .matches(/^[a-zA-Z\/\- ]*$/)
    .withMessage("Invalid Authority Entry!")
    .trim(),
  body("administrator")
    .if(body("administrator").notEmpty())
    .matches(/^[a-zA-Z0-9\/\-,. ]*$/)
    .withMessage("Invalid Administrator Entry!")
    .trim(),
  body("status")
    .if(body("status").notEmpty())
    .matches(/^[a-zA-Z\/\- ]*$/)
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

    // dropdown values.
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
      return res.render("policies/addPolicy", {
        title: "BWG | Add Policy",
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
          notes: req.body.notes,
        },
      });
    } else {
      // db stuff.
      Policy.create({
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
        notes: req.body.notes,
      })
        // redirect to /policies.
        .then(res.redirect("/policies"))
        .catch((err) => {
          return res.render("policies/addPolicy", {
            title: "BWG | Add Policy",
            message: "Page Error!",
          });
        });
    }
  }
);

module.exports = router;
