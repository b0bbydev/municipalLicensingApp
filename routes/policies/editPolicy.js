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
  isLoggedIn,
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

      // get dog info from custom query.
      var policyInfo = await dbHelpers.getPolicyInfo(req.params.id);

      return res.render("policies/editPolicy", {
        title: "BWG | Edit Policy",
        errorMessages: messages,
        email: req.session.email,
        statusDropdownValues: statusDropdownValues,
        categoryDropdownValues: categoryDropdownValues,
        authorityDropdownValues: authorityDropdownValues,
        policyInfo: {
          policyNumber: policyInfo[0].policyNumber,
          policyName: policyInfo[0].policyName,
          cowResolve: policyInfo[0].cowResolve,
          cowDate: policyInfo[0].cowDate,
          councilResolution: policyInfo[0].councilResolution,
          dateAdopted: policyInfo[0].dateAdopted,
          dateAmended: policyInfo[0].dateAmended,
          lastReviewDate: policyInfo[0].lastReviewDate,
          scheduledReviewDate: policyInfo[0].scheduledReviewDate,
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
  isLoggedIn,
  body("policyNumber")
    .if(body("policyNumber").notEmpty())
    .matches(/^[0-9-]*$/)
    .withMessage("Invalid Policy Number Entry!")
    .trim(),
  body("policyName")
    .if(body("policyName").notEmpty())
    .matches(/^[a-zA-z\/\- ]*$/)
    .withMessage("Invalid Policy Name Entry!")
    .trim(),
  body("cowResolve")
    .if(body("cowResolve").notEmpty())
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("Invalid COW Resolve Entry!")
    .trim(),
  body("cowDate")
    .if(body("cowDate").notEmpty())
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("Invalid COW Date Entry!")
    .trim(),
  body("status")
    .if(body("status").notEmpty())
    .matches(/^[a-zA-z\/\- ]*$/)
    .withMessage("Invalid Status Entry!")
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
  body("category")
    .if(body("category").notEmpty())
    .matches(/^[a-zA-z\/\- ]*$/)
    .withMessage("Invalid Category Entry!")
    .trim(),
  body("authority")
    .if(body("authority").notEmpty())
    .matches(/^[a-zA-z\/\- ]*$/)
    .withMessage("Invalid Authority Entry!")
    .trim(),
  body("notes")
    .if(body("notes").notEmpty())
    .matches(/^[a-zA-z0-9\/\-, ]*$/)
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
        // if the form submission is unsuccessful, save their values.
        formData: {
          policyNumber: req.body.policyNumber,
          policyName: req.body.policyName,
          cowResolve: req.body.cowResolve,
          cowDate: req.body.cowDate,
          councilResolution: req.body.councilResolution,
          dateAdopted: req.body.dateAdopted,
          dateAmended: req.body.dateAmended,
          status: req.body.status,
          lastReviewDate: req.body.lastReviewDate,
          scheduledReviewDate: req.body.scheduledReviewDate,
          category: req.body.category,
          authority: req.body.authority,
          notes: req.body.notes,
        },
      });
    } else {
      // db stuff.
      Policy.update(
        {
          policyNumber: req.body.policyNumber,
          policyName: req.body.policyName,
          cowResolve: req.body.cowResolve,
          cowDate: req.body.cowDate,
          councilResolution: req.body.councilResolution,
          dateAdopted: req.body.dateAdopted,
          dateAmended: req.body.dateAmended,
          status: req.body.status,
          lastReviewDate: req.body.lastReviewDate,
          scheduledReviewDate: req.body.scheduledReviewDate,
          category: req.body.category,
          authority: req.body.authority,
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
