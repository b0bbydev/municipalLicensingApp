var express = require("express");
var router = express.Router();
const { isLoggedIn } = require("../../config/authHelpers");
// models.
const Dropdown = require("../../models/dropdownManager/dropdown");
const Policy = require("../../models/policies/policy");
// express-validate.
const { body, validationResult } = require("express-validator");
// express-rate-limit.
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: "Too many requests! Slow down!",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/* GET /addPolicy */
router.get("/", limiter, async (req, res, next) => {
  // server side validation.
  const errors = validationResult(req);

  // if errors is NOT empty (if there are errors...).
  if (!errors.isEmpty()) {
    return res.render("policies/addPolicy", {
      title: "BWG | Add Policy",
      message: "Page Error!",
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
      dogAuth: req.session.dogAuth,
      admin: req.session.admin,
      statusDropdownValues: statusDropdownValues,
      categoryDropdownValues: categoryDropdownValues,
      authorityDropdownValues: authorityDropdownValues,
    });
  }
});

/* POST /addPolicy */
router.post(
  "/",
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
      Policy.create({
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
      })
        .then((results) => {
          // redirect to /policies
          res.redirect("/policies");
        })
        .catch((err) => {
          return res.render("policies/addPolicy", {
            title: "BWG | Add Policy",
            message: "Page Error! ",
          });
        });
    }
  }
);

module.exports = router;
