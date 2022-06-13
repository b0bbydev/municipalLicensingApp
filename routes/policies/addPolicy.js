var express = require("express");
var router = express.Router();
// models.
const Dropdown = require("../../models/dropdownManager/dropdown");
const Policy = require("../../models/policies/policy");
// express-validate.
const { body, validationResult } = require("express-validator");

/* GET /addDog/:id */
router.get("/", async (req, res, next) => {
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
      statusDropdownValues: statusDropdownValues,
      categoryDropdownValues: categoryDropdownValues,
      authorityDropdownValues: authorityDropdownValues,
    });
  }
});

router.post(
  "/",
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
      Policy.create({
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
