var express = require("express");
var router = express.Router();
// dbHelpers.
var dbHelpers = require("../../config/dbHelpers");
// express-validate.
const { param, validationResult } = require("express-validator");

/* GET /policies/editPolicy/:id */
router.get(
  "/:id",
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

      // get dog info from custom query.
      var policyInfo = await dbHelpers.getPolicyInfo(req.params.id);

      return res.render("policies/editPolicy", {
        title: "BWG | Edit Policy",
        errorMessages: messages,
        email: req.session.email,
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

module.exports = router;
