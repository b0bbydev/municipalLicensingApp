var express = require("express");
var router = express.Router();
const { isLoggedIn } = require("../../config/authHelpers");
// models.
const Dropdown = require("../../models/dropdownManager/dropdown");
const Policy = require("../../models/policies/policy");
// dbHelpers.
var dbHelpers = require("../../config/dbHelpers");
// express-validate.
const { param, body, validationResult } = require("express-validator");
// express-rate-limit.
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: "Too many requests! Slow down!",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/* GET /policies/editPolicy/:id */
router.get(
  "/:id",
  limiter,
  param("id").matches(/^\d+$/).trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...).
    if (!errors.isEmpty()) {
      return res.render("policies/editPolicy", {
        title: "BWG | Edit Policy",
        message: "Page Error!",
      });
    } else {
      // check if there's an error message in the session.
      let messages = req.session.messages || [];
      // clear session messages.
      req.session.messages = [];

      // save policyID to session.
      req.session.policyID = req.params.id;

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

      // this helps populate the fields when page loads.
      var policyInfo = await dbHelpers.getPolicyInfo(req.params.id);

      return res.render("policies/editPolicy", {
        title: "BWG | Edit Policy",
        errorMessages: messages,
        email: req.session.email,
        dogAuth: req.session.dogAuth,
        admin: req.session.admin,
        statusDropdownValues: statusDropdownValues,
        categoryDropdownValues: categoryDropdownValues,
        authorityDropdownValues: authorityDropdownValues,
        policyInfo: {
          policyNumber: policyInfo[0].policyNumber,
          policyName: policyInfo[0].policyName,
          cowDate: policyInfo[0].cowDate,
          councilResolution: policyInfo[0].councilResolution,
          dateApproved: policyInfo[0].dateApproved,
          dateAmended: policyInfo[0].dateAmended,
          dateEffective: policyInfo[0].dateEffective,
          category: policyInfo[0].category,
          lastReviewDate: policyInfo[0].lastReviewDate,
          scheduledReviewDate: policyInfo[0].scheduledReviewDate,
          division: policyInfo[0].division,
          authority: policyInfo[0].authority,
          administrator: policyInfo[0].administrator,
          status: policyInfo[0].status,
          notes: policyInfo[0].notes,
        },
      });
    }
  }
);

/* POST /policies/editPolicy/:id */
router.post(
  "/:id",
  limiter,
  body("policyNumber")
    .if(body("policyNumber").notEmpty())
    .matches(/^[0-9-]*$/)
    .withMessage("Invalid Policy Number Entry!")
    .trim(),
  body("policyName")
    .if(body("policyName").notEmpty())
    .matches(/^[a-zA-Z\/\- ]*$/)
    .withMessage("Invalid Policy Name Entry!")
    .trim(),
  body("cowDate")
    .if(body("cowDate").notEmpty())
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("Invalid COW Date Entry!")
    .trim(),
  body("councilResolution")
    .if(body("councilResolution").notEmpty())
    .matches(/^[a-zA-Z0-9\/\- ]*$/)
    .withMessage("Invalid Council Resolution Entry!")
    .trim(),
  body("dateApproved")
    .if(body("dateApproved").notEmpty())
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("Invalid Date Approved Entry!")
    .trim(),
  body("dateAmended")
    .if(body("dateAmended").notEmpty())
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("Invalid Date Amended Entry!")
    .trim(),
  body("dateEffective")
    .if(body("dateEffective").notEmpty())
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("Invalid Date Effective Entry!")
    .trim(),
  body("category")
    .if(body("category").notEmpty())
    .matches(/^[a-zA-Z\/\- ]*$/)
    .withMessage("Invalid Category Entry!")
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
  body("division")
    .if(body("division").notEmpty())
    .matches(/^[a-zA-Z\/\- ]*$/)
    .withMessage("Invalid Division Entry!")
    .trim(),
  body("authority")
    .if(body("authority").notEmpty())
    .matches(/^[a-zA-Z\/\- ]*$/)
    .withMessage("Invalid Authority Entry!")
    .trim(),
  body("administrator")
    .if(body("administrator").notEmpty())
    .matches(/^[a-zA-Z\/\- ]*$/)
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

    // if errors is NOT empty (if there are errors...).
    if (!errors.isEmpty()) {
      return res.render("policies/addPolicy", {
        title: "BWG | Add Policy",
        message: errorArray[0].msg,
        email: req.session.email,
        dogAuth: req.session.dogAuth,
        admin: req.session.admin,
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
          status: req.body.status,
          notes: req.body.notes,
        },
      });
    } else {
      // db stuff.
      Policy.update(
        {
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
          status: req.body.status,
          notes: req.body.notes,
        },
        {
          where: {
            policyID: req.session.policyID,
          },
        }
      )
        .then((results) => {
          // redirect to /policies
          res.redirect("/policies");
        })
        .catch((err) => {
          return res.render("policies/editPolicy", {
            title: "BWG | Edit Policy",
            message: "Page Error! ",
          });
        });
    }
  }
);

module.exports = router;
