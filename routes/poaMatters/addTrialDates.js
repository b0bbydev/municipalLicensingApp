var express = require("express");
var router = express.Router();
// models.
const POAMatterTrial = require("../../models/poaMatters/poaMatterTrial");
// helpers.
const funcHelpers = require("../../config/funcHelpers");
// express-validate.
const { body, param, validationResult } = require("express-validator");

/* GET /poaMatters/addTrialDates/:id */
router.get(
  "/:id",
  param("id").matches(/^\d+$/).trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...),
    if (!errors.isEmpty()) {
      return res.render("poaMatters/addTrialDates", {
        title: "BWG | Add Trial Dates",
        message: "Page Error!",
        email: req.session.email,
        auth: req.session.auth, // authorization.
      });
    } else {
      // check if there's an error message in the session
      let messages = req.session.messages || [];
      // clear session messages
      req.session.messages = [];

      return res.render("poaMatters/addTrialDates", {
        title: "BWG | Add Trial Dates",
        errorMessages: messages,
        email: req.session.email,
        auth: req.session.auth, // authorization.
      });
    }
  }
);

/* POST /poaMatters/addTrialDates/:id */
router.post(
  "/:id",
  param("id").matches(/^\d+$/).trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // use built-in array() to convert Result object to array for custom error messages.
    var errorArray = errors.array();

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("poaMatters/addTrialDates", {
        title: "BWG | Add Trial Dates",
        message: errorArray[0].msg, // custom error message. (should indicate which field has the error.)
        email: req.session.email,
        auth: req.session.auth, // authorization.
        // if the form submission is unsuccessful, save their values.
        formData: {
          trialDateOne: req.body.trialDateOne,
          trialDateTwo: req.body.trialDateTwo,
          trialDateThree: req.body.trialDateThree,
        },
      });
    } else {
      // create array for bulkCreate.
      let trialDates = [
        {
          trialDate: funcHelpers.fixEmptyValue(req.body.trialDateOne),
          poaMatterID: req.params.id,
        },
        {
          trialDate: funcHelpers.fixEmptyValue(req.body.trialDateTwo),
          poaMatterID: req.params.id,
        },
        {
          trialDate: funcHelpers.fixEmptyValue(req.body.trialDateThree),
          poaMatterID: req.params.id,
        },
      ];

      // loops through trialDates and if trialDate is null, delete that whole specific object in the array.
      for (const key in trialDates) {
        if (trialDates[key].trialDate === null) {
          // remove the key/object from the array.
          trialDates.splice([key]);
        }
      }

      // insert the array.
      POAMatterTrial.bulkCreate(trialDates)
        .then(() => {
          return res.redirect("/poaMatters");
        })
        .catch((err) => {
          return res.render("poaMatters/addTrialDates", {
            title: "BWG | Add Trial Dates",
            message: "Page Error!",
          });
        });
    }
  }
);

module.exports = router;
