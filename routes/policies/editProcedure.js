var express = require("express");
var router = express.Router();
const { isLoggedIn } = require("../../config/authHelpers");
// models.
const Dropdown = require("../../models/dropdownManager/dropdown");
const Procedure = require("../../models/policies/procedure");
// express-validate.
const { param, body, validationResult } = require("express-validator");
// request limiter.
const limiter = require("../../config/limiter");

/* GET /policies/editProcedure/:id */
router.get(
  "/:id",
  limiter,
  param("id").matches(/^\d+$/).trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...).
    if (!errors.isEmpty()) {
      return res.render("policies/editProcedure", {
        title: "BWG | Edit Procedure",
        message: "Page Error!",
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
          dogAuth: req.session.dogAuth,
          admin: req.session.admin,
          statusDropdownValues: statusDropdownValues,
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

module.exports = router;
