var express = require("express");
var router = express.Router();
// models.
const Dropdown = require("../../models/dropdownManager/dropdown");
const Procedure = require("../../models/policies/procedure");
// helpers.
const funcHelpers = require("../../config/funcHelpers");
// authHelper middleware.
const {
  dogLicenseAuth,
  adminAuth,
  isLoggedIn,
} = require("../../config/authHelpers");
// express-validate.
const { body, validationResult } = require("express-validator");
// request limiter.
const limiter = require("../../config/limiter");

/* GET home page. */
router.get("/:id", async (req, res, next) => {
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
    title: "BWG | Add Procedure",
    errorMessages: messages,
    email: req.session.email,
    dogAuth: req.session.dogAuth, // authorization.
    admin: req.session.admin, // authorization.
    statusDropdownValues: statusDropdownValues,
  });
});

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
        title: "BWG | Add Policy",
        message: errorArray[0].msg,
        email: req.session.email,
        dogAuth: req.session.dogAuth,
        admin: req.session.admin,
        statusDropdownValues: statusDropdownValues,
        // if the form submission is unsuccessful, save their values.
        formData: {
          procedureName: req.body.procedureName,
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
      Procedure.create({
        procedureName: req.body.procedureName,
        status: req.body.status,
        dateApproved: funcHelpers.fixDate(req.body.dateApproved),
        dateAmended: funcHelpers.fixDate(req.body.dateAmended),
        lastReviewDate: funcHelpers.fixDate(req.body.lastReviewDate),
        scheduledReviewDate: funcHelpers.fixDate(req.body.scheduledReviewDate),
        notes: req.body.notes,
        policyID: req.params.id,
      })
        // redirect back to the policy they were viewing.
        .then(res.redirect("/policies/policy/" + req.session.policyID))
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
