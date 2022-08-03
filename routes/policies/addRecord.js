var express = require("express");
var router = express.Router();
// models.
const Dropdown = require("../../models/dropdownManager/dropdown");
const Procedure = require("../../models/policies/procedure");
const Guideline = require("../../models/policies/guideline");
// helpers.
const funcHelpers = require("../../config/funcHelpers");
// express-validate.
const { body, validationResult } = require("express-validator");

/* GET /addRecord */
router.get("/", async (req, res, next) => {
  // check if there's an error message in the session.
  let messages = req.session.messages || [];
  // clear session messages.
  req.session.messages = [];
  // delete session policyID.
  delete req.session.policyID;

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

  return res.render("policies/addRecord", {
    title: "BWG | Add Record",
    errorMessages: messages,
    email: req.session.email,
    auth: req.session.auth, // authorization.
    statusDropdownValues: statusDropdownValues,
    categoryDropdownValues: categoryDropdownValues,
    authorityDropdownValues: authorityDropdownValues,
  });
});

/* POST /addProcedure */
router.post(
  "/addProcedure",
  body("procedureName")
    .if(body("procedureName").notEmpty())
    .matches(/^[^%<>^$\/\\;!{}?]+$/)
    .withMessage("Invalid Procedure Name Entry!")
    .trim(),
  body("status")
    .if(body("status").notEmpty())
    .matches(/^[^%<>^$\/\\;!{}?]+$/)
    .withMessage("Invalid Status Entry!")
    .trim(),
  body("category")
    .if(body("category").notEmpty())
    .matches(/^[^%<>^$\/\\;!{}?]+$/)
    .withMessage("Invalid Category Entry!")
    .trim(),
  body("notes")
    .if(body("notes").notEmpty())
    .matches(/^[\r\na-zA-Z0-9\/\-,.:"' ]+/)
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
      return res.render("policies/addProcedure", {
        title: "BWG | Add Policy",
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

/* POST /addGuideline */
router.post(
  "/addGuideline",
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
    .matches(/^[\r\na-zA-Z0-9\/\-,.:"' ]+/)
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
      return res.render("policies/addGuideline", {
        title: "BWG | Add Policy",
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
          category: req.body.category,
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
        category: req.body.category,
        notes: req.body.notes,
      })
        // redirect back to the policy they were viewing.
        .then(res.redirect("/policies"))
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
