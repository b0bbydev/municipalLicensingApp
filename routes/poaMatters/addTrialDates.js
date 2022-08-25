var express = require("express");
var router = express.Router();
// models.
const POAMatterTrial = require("../../models/poaMatters/poaMatterTrial");
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
        message: messages,
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
      });
    } else {
      /*
      this is probably the most disgusting bit of code I've written, but it will have to do until I can come up with a better solution.

      this will also NOT work if a user tries to enter more than 10 additional trial dates at once. (will probably never happen but that's the purpose of having 10)

      the idea is to work with the createTrialDateFields() function in scripts.js
      it will create x amount of 'trialDateFields' and 'trialCommentFields' with
      the index number appended to the end. hence the naming convention.
      */
      let trialDates = [
        {
          trialDate: req.body.trialDateField1,
          trialComment: req.body.trialCommentField1,
          poaMatterID: req.params.id,
        },
        {
          trialDate: req.body.trialDateField2,
          trialComment: req.body.trialCommentField2,
          poaMatterID: req.params.id,
        },
        {
          trialDate: req.body.trialDateField3,
          trialComment: req.body.trialCommentField3,
          poaMatterID: req.params.id,
        },
        {
          trialDate: req.body.trialDateField4,
          trialComment: req.body.trialCommentField4,
          poaMatterID: req.params.id,
        },
        {
          trialDate: req.body.trialDateField5,
          trialComment: req.body.trialCommentField5,
          poaMatterID: req.params.id,
        },
        {
          trialDate: req.body.trialDateField6,
          trialComment: req.body.trialCommentField6,
          poaMatterID: req.params.id,
        },
        {
          trialDate: req.body.trialDateField7,
          trialComment: req.body.trialCommentField7,
          poaMatterID: req.params.id,
        },
        {
          trialDate: req.body.trialDateField8,
          trialComment: req.body.trialCommentField8,
          poaMatterID: req.params.id,
        },
        {
          trialDate: req.body.trialDateField9,
          trialComment: req.body.trialCommentField9,
          poaMatterID: req.params.id,
        },
        {
          trialDate: req.body.trialDateField10,
          trialComment: req.body.trialCommentField10,
          poaMatterID: req.params.id,
        },
      ];

      // this handles the case of: even though we have 10 objects in our array,
      // if the user enters less than 10, it will delete the empty objects before inserting
      // loops through trialDates and if trialDate is null or undefined/whatever, delete that whole specific object in the array.
      for (const key in trialDates) {
        if (
          trialDates[key].trialDate === undefined ||
          trialDates[key].trialDate === null ||
          trialDates[key].trialDate === "" ||
          trialDates[key].trialDate === " "
        ) {
          // remove the key/object from the array.
          trialDates.splice([key]);
        }
      }

      // also have to reverse the array of trialDate objects because of how Promises work.
      // (Sequelize bulkCreate() and every other Sequelize function is Promised based).
      trialDates.reverse();

      // insert the array.
      POAMatterTrial.bulkCreate(trialDates)
        .then(() => {
          return res.redirect("/poaMatters");
        })
        .catch((err) => {
          return res.render("poaMatters/addTrialDates", {
            title: "BWG | Add Trial Dates",
            message: "Page Error!",
            auth: req.session.auth, // authorization.
          });
        });
    }
  }
);

module.exports = router;
