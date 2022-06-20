var express = require("express");
var router = express.Router();
const { isLoggedIn } = require("../../config/authHelpers");
// models.
const Dropdown = require("../../models/dropdownManager/dropdown");
const DropdownForm = require("../../models/dropdownManager/dropdownForm");
// dbHelpers.
var dbHelpers = require("../../config/dbHelpers");
// sequelize.
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
// pagination lib.
const paginate = require("express-paginate");
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

/* GET /dropdownManager */
router.get("/", limiter, isLoggedIn, async (req, res, next) => {
  // check if there's an error message in the session
  let messages = req.session.messages || [];
  // clear session messages
  req.session.messages = [];

  DropdownForm.findAndCountAll({
    limit: req.query.limit,
    offset: req.skip,
  })
    .then((results) => {
      return res.render("dropdownManager/index", {
        title: "BWG | Dropdown Manager",
        errorMessages: messages,
        email: req.session.email,
        dogAuth: req.session.dogAuth,
        admin: req.session.admin,
        data: results.rows,
        back: req.headers.referer,
      });
    })
    .catch((err) => {
      return res.render("dropdownManager/index", {
        title: "BWG | Dropdown Manager",
        message: "Page Error! ",
      });
    });
});

/* POST /dropdownManger */
router.post(
  "/",
  limiter,
  isLoggedIn,
  body("formName")
    .notEmpty()
    .matches(/^[a-zA-z0-9\/\- ]*$/)
    .withMessage("Invalid Form/Dropdown Name Entry!")
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
        dogAuth: req.session.dogAuth,
        admin: req.session.admin,
      });
    } else {
      // create dropdown form.
      DropdownForm.create({
        formName: req.body.formName,
      })
        .then((result) => {
          res.redirect("/dropdownManager");
        })
        .catch((err) => {
          return res.render("dropdownManager/index", {
            title: "BWG | Dropdown Manager",
            message: "Page Error! ",
          });
        });
    }
  }
);

/* GET /dropdownManager/form/:id */
router.get(
  "/form/:id",
  limiter,
  isLoggedIn,
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
        dogAuth: req.session.dogAuth,
        admin: req.session.admin,
      });
    } else {
      // check if there's an error message in the session.
      let messages = req.session.messages || [];
      // clear session messages.
      req.session.messages = [];

      // store formID in session to use in other endpoints.
      req.session.formID = req.params.id;
      // get formName.
      var formName = await dbHelpers.getFormNameFromFormID(req.session.formID);

      // if there are no filter parameters.
      if (!req.query.filterCategory || !req.query.filterValue) {
        // get all dropdown values from specified dropdownForm.
        Dropdown.findAndCountAll({
          limit: req.query.limit,
          offset: req.skip,
          where: {
            dropdownFormID: req.params.id,
          },
        })
          .then((results) => {
            // for pagination.
            const itemCount = results.count;
            const pageCount = Math.ceil(results.count / req.query.limit);

            return res.render("dropdownManager/form", {
              title: "BWG | Dropdown Manager - " + formName[0].formName,
              errorMessages: messages,
              email: req.session.email,
              dogAuth: req.session.dogAuth,
              admin: req.session.admin,
              formName: formName[0].formName,
              lastEnteredDropdownTitle: req.session.lastEnteredDropdownTitle,
              data: results.rows,
              dropdownFormID: req.params.id,
              pageCount,
              itemCount,
              queryCount: "Records returned: " + results.count,
              pages: paginate.getArrayPages(req)(5, pageCount, req.query.page),
              prev: paginate.href(req)(true),
              hasMorePages: paginate.hasNextPages(req)(pageCount),
            });
          })
          // catch any scary errors and render page error.
          .catch((err) =>
            res.render("dropdownManager", {
              title: "BWG | Dropdown Manager",
              message: "Page Error! ",
            })
          );
      } else {
        // create filter query.
        Dropdown.findAndCountAll({
          where: {
            [req.query.filterCategory]: {
              [Op.like]: req.query.filterValue + "%",
            },
          },
          limit: req.query.limit,
          offset: req.skip,
        })
          .then((results) => {
            // for pagination.
            const itemCount = results.count;
            const pageCount = Math.ceil(results.count / req.query.limit);

            return res.render("dropdownManager/form", {
              title: "BWG | Dropdown Manager",
              email: req.session.email,
              dogAuth: req.session.dogAuth,
              admin: req.session.admin,
              data: results.rows,
              dropdownFormID: req.params.id,
              pageCount,
              itemCount,
              queryCount: "Records returned: " + results.count,
              pages: paginate.getArrayPages(req)(5, pageCount, req.query.page),
              prev: paginate.href(req)(true),
              hasMorePages: paginate.hasNextPages(req)(pageCount),
            });
          })
          // catch any scary errors and render page error.
          .catch((err) =>
            res.render("dropdownManager/form", {
              title: "BWG | Dropdown Manager",
              message: "Page Error! ",
            })
          );
      }
    }
  }
);

/* POST /dropdownManager/form/:id */
router.post(
  "/form/:id",
  limiter,
  isLoggedIn,
  body("dropdownValue")
    .notEmpty()
    .matches(/^[^'";=_()*&%$#!<>\^\\]*$/)
    .withMessage("Invalid Dropdown Value Entry!")
    .trim(),
  body("dropdownTitle")
    .notEmpty()
    .matches(/^[^'";=_()*&%$#!<>\^\\]*$/)
    .withMessage("Invalid Dropdown Title Entry!")
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
        email: req.session.email,
        dogAuth: req.session.dogAuth,
        admin: req.session.admin,
      });
    } else {
      Dropdown.create({
        dropdownTitle: req.body.dropdownTitle,
        dropdownValue: req.body.dropdownValue,
        isDisabled: 0, // *enable* by default.
        dropdownFormID: req.session.formID,
      })
        .then((results) => {
          // save last entered dropdownTitle in the session.
          req.session.lastEnteredDropdownTitle = req.body.dropdownTitle;
          // redirect to same page if successful.
          res.redirect("/dropdownManager/form/" + req.session.formID);
        })
        .catch((err) => {
          return res.render("dropdownManager/index", {
            title: "BWG | Dropdown Manager",
            message: "Page Error! ",
          });
        });
    }
  }
);

/* DISABLE dropdownManager/disable/:id */
router.get(
  "/disable/:id",
  limiter,
  isLoggedIn,
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
        email: req.session.email,
        dogAuth: req.session.dogAuth,
        admin: req.session.admin,
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
      )
        .then((results) => {
          // redirect to same page after success.
          res.redirect("/dropdownManager/form/" + req.session.formID);
        })
        .catch((err) => {
          return res.render("dropdownManager/index", {
            title: "BWG | Dropdown Manager",
            message: "Page Error! ",
          });
        });
    }
  }
);

/* ENABLE dropdownManager/enable/:id */
router.get(
  "/enable/:id",
  limiter,
  isLoggedIn,
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
        email: req.session.email,
        dogAuth: req.session.dogAuth,
        admin: req.session.admin,
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
      )
        .then((results) => {
          // redirect to same page after success.
          res.redirect("/dropdownManager/form/" + req.session.formID);
        })
        .catch((err) => {
          return res.render("dropdownManager/index", {
            title: "BWG | Dropdown Manager",
            message: "Page Error! ",
          });
        });
    }
  }
);

module.exports = router;
