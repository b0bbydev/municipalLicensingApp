var express = require("express");
var router = express.Router();
// models.
const Dropdown = require("../../models/dropdownManager/dropdown");
const Procedure = require("../../models/policies/procedure");
// express-validate.
const { param, body, validationResult } = require("express-validator");

/* GET /policies/editProcedure/:id */
router.get(
  "/:id",
  param("id").matches(/^\d+$/).trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...).
    if (!errors.isEmpty()) {
      return res.render("policies/editProcedure", {
        title: "BWG | Edit Procedure",
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

      Procedure.findOne({
        where: {
          procedureID: req.params.id, // procedureID is passed into URL.
        },
      }).then((results) => {
        return res.render("policies/editProcedure", {
          title: "BWG | Edit Procedure",
          errorMessages: messages,
          email: req.session.email,
          auth: req.session.auth, // authorization.
          statusDropdownValues: statusDropdownValues,
          // if the form submission is unsuccessful, save their values.
          procedureInfo: {
            procedureName: results.procedureName,
            approvalDate: results.approvalDate,
            lastReviewDate: results.lastReviewDate,
            scheduledReviewDate: results.scheduledReviewDate,
            dateAmended: results.dateAmended,
            status: results.status,
            notes: results.notes,
          },
        });
      });
    }
  }
);

/* POST /policies/editProcedure/:id */
router.post(
  "/:id",
  param("id").matches(/^\d+$/).trim(),
  body("procedureName")
    .if(body("procedureName").notEmpty())
    .matches(/^[a-zA-Z0-9\/\-,. ]*$/)
    .withMessage("Invalid Procedure Name Entry!")
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
      return res.render("policies/editProcedure", {
        title: "BWG | Edit Procedure",
        message: errorArray[0].msg,
        email: req.session.email,
        auth: req.session.auth, // authorization.
        // if the form submission is unsuccessful, save their values.
        formData: {
          procedureName: req.body.procedureName,
          dateApproved: req.body.dateApproved,
          lastReviewDate: req.body.lastReviewDate,
          scheduledReviewDate: req.body.scheduledReviewDate,
          dateAmended: req.body.dateAmended,
          status: req.body.status,
          notes: req.body.notes,
        },
      });
    } else {
      // db stuff.
      Procedure.update(
        {
          procedureName: req.body.procedureName,
          dateApproved: req.body.dateApproved,
          lastReviewDate: req.body.lastReviewDate,
          scheduledReviewDate: req.body.scheduledReviewDate,
          dateAmended: req.body.dateAmended,
          status: req.body.status,
          notes: req.body.notes,
        },
        {
          where: {
            procedureID: req.params.id,
          },
        }
      )
        .then(res.redirect("/policies/policy/" + req.session.policyID))
        .catch((err) => {
          return res.render("policies/editProcedure", {
            title: "BWG | Edit Procedure",
            message: "Page Error!",
          });
        });
    }
  }
);

module.exports = router;
