var express = require("express");
var router = express.Router();
const { redirectToLogin } = require("../../config/authHelpers");
// models.
const Dropdown = require("../../models/dropdownManager/dropdown");
const DropdownForm = require("../../models/dropdownManager/dropdownForm");
// dbHelpers.
var dbHelpers = require("../../config/dbHelpers");
// express-validate.
const { param, body, validationResult } = require("express-validator");

/* GET /dropdownManger */
router.get("/", async (req, res, next) => {
  // check if there's an error message in the session
  let messages = req.session.messages || [];

  // clear session messages
  req.session.messages = [];

  DropdownForm.findAndCountAll({
    limit: req.query.limit,
    offset: req.skip,
  }).then((results) => {
    return res.render("dropdownManager/index", {
      title: "BWG | Dropdown Manager",
      errorMessages: messages,
      email: req.session.email,
      data: results.rows,
    });
  });
});

/* POST /dropdownManger */
router.post(
  "/",
  body("formName")
    .matches(/^[^'";=_()*&%$#!<>\/\^\\]*$/)
    .trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("dropdownManager", {
        title: "BWG | Dropdown Manager",
        message: "Error!",
        email: req.session.email,
      });
    } else {
      // create dropdown form.
      DropdownForm.create({
        formName: req.body.formName,
      }).then((result) => {
        res.redirect("/dropdownManager");
      });
    }
  }
);

router.get(
  "/form/:id",
  param("id").matches(/^\d+$/).trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("dropdownManager", {
        title: "BWG | Dropdown Manager",
        message: "Error!",
        email: req.session.email,
      });
    } else {
      // check if there's an error message in the session
      let messages = req.session.messages || [];

      // clear session messages
      req.session.messages = [];

      // store formID in session to use in other endpoints.
      req.session.formID = req.params.id;

      // get formName.
      var formName = await dbHelpers.getFormNameFromFormID(req.session.formID);

      Dropdown.findAndCountAll({
        limit: req.query.limit,
        offset: req.skip,
        where: {
          dropdownFormID: req.params.id,
        },
      }).then((results) => {
        return res.render("dropdownManager/form", {
          title: "BWG | " + formName[0].formName,
          errorMessages: messages,
          email: req.session.email,
          formName: formName[0].formName,
          data: results.rows,
        });
      });
    }
  }
);

/* POST dropdownManager/form/:id */
router.post(
  "/form/:id",
  body("value")
    .matches(/^[^'";=_()*&%$#!<>\/\^\\]*$/)
    .trim(),
  param("id").matches(/^\d+$/).trim(),
  function (req, res, next) {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      // render dropdown page with error message.
      return res.render("dropdownManager/index", {
        title: "BWG | Dropdown Manager",
        message: "Invalid entry!",
      });
    } else {
      Dropdown.create({
        value: req.body.value,
        isDisabled: 0, // *enable* by default.
        dropdownFormID: req.session.formID,
      }).then((results) => {
        // redirect to same page if successful.
        res.redirect("/dropdownManager/form/" + req.session.formID);
      });
    }
  }
);

/* DISABLE dropdownManager/disable/:id */
router.get(
  "/disable/:id",
  param("id").matches(/^\d+$/).trim(),
  (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      // render dropdown page with error message.
      return res.render("dropdownManager/index", {
        title: "BWG | Dropdown Manager",
        message: "Invalid entry!",
      });
    } else {
      Dropdown.update(
        {
          isDisabled: 1,
        },
        {
          where: {
            dropdownID: req.params.id, // req.params.id == dropdownID
          },
        }
      ).then((results) => {
        // redirect to same page after success.
        res.redirect("/dropdownManager/form/" + req.session.formID);
      });
    }
  }
);

/* ENABLE dropdownManager/enable/:id */
router.get(
  "/enable/:id",
  param("id").matches(/^\d+$/).trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      // render dropdown page with error message.
      return res.render("dropdownManager/index", {
        title: "BWG | Dropdown Manager",
        message: "Invalid entry!",
      });
    } else {
      Dropdown.update(
        {
          isDisabled: 0,
        },
        {
          where: {
            dropdownID: req.params.id, // req.params.id == dropdownID
          },
        }
      ).then((results) => {
        // redirect to same page after success.
        res.redirect("/dropdownManager/form/" + req.session.formID);
      });
    }
  }
);

module.exports = router;
