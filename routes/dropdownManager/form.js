var express = require("express");
var router = express.Router();
// models.
const Dropdown = require("../../models/dropdownManager/dropdown");
const DropdownForm = require("../../models/dropdownManager/dropdownForm");
// helpers.
const funcHelpers = require("../../config/funcHelpers");
// sequelize.
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
// pagination lib.
const paginate = require("express-paginate");
// express-validate.
const { param, body, validationResult } = require("express-validator");

/* GET /dropdownManager/form/:id */
router.get(
  "/:id",
  param("id").matches(/^\d+$/).trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("dropdownManager/form", {
        title: "BWG | Dropdown Manager",
        message: "Error!",
        email: req.session.email,
        auth: req.session.auth, // authorization.
      });
    } else {
      // check if there's an error message in the session.
      let messages = req.session.messages || [];
      // clear session messages.
      req.session.messages = [];

      // store formID in session to use in other endpoints.
      req.session.formID = req.params.id;

      DropdownForm.findOne({
        attributes: ["formName"],
        where: {
          dropdownFormID: req.session.formID,
        },
      }).then((results) => {
        if (results) {
          formName = results.formName;
        } else {
          formName = null;
        }
      });

      // if there are no filter parameters.
      if (!req.query.filterCategory || !req.query.filterValue) {
        // get all dropdown values from specified dropdownForm.
        Dropdown.findAndCountAll({
          limit: req.query.limit,
          offset: req.skip,
          order: [["dropdownID", "DESC"]],
          where: {
            dropdownFormID: req.session.formID,
          },
        })
          .then((results) => {
            // for pagination.
            const itemCount = results.count;
            const pageCount = Math.ceil(results.count / req.query.limit);

            return res.render("dropdownManager/form", {
              title: "BWG | Dropdown Manager",
              message: messages,
              email: req.session.email,
              auth: req.session.auth, // authorization.
              formName: formName,
              lastEnteredDropdownTitle: req.session.lastEnteredDropdownTitle,
              data: results.rows,
              dropdownFormID: req.session.formID,
              pageCount,
              itemCount,
              queryCount: "Records returned: " + results.count,
              pages: paginate.getArrayPages(req)(5, pageCount, req.query.page),
              prev: paginate.href(req)(true),
              hasMorePages: paginate.hasNextPages(req)(pageCount),
            });
          })
          // catch any scary errors and render page error.
          .catch((err) => {
            return res.render("dropdownManager/form", {
              title: "BWG | Dropdown Manager",
              message: "Page Error!",
            });
          });
      } else {
        // format filterCategory to match column name in db - via handy dandy camelize() function.
        var filterCategory = funcHelpers.camelize(req.query.filterCategory);

        // create filter query.
        Dropdown.findAndCountAll({
          where: {
            [filterCategory]: {
              [Op.like]: "%" + req.query.filterValue + "%",
            },
            dropdownFormID: req.session.formID,
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
              auth: req.session.auth, // authorization.
              formName: formName,
              data: results.rows,
              dropdownFormID: req.session.formID,
              filterCategory: req.query.filterCategory,
              filterValue: req.query.filterValue,
              pageCount,
              itemCount,
              queryCount: "Records returned: " + results.count,
              pages: paginate.getArrayPages(req)(5, pageCount, req.query.page),
              prev: paginate.href(req)(true),
              hasMorePages: paginate.hasNextPages(req)(pageCount),
            });
          })
          // catch any scary errors and render page error.
          .catch((err) => {
            return res.render("dropdownManager/form", {
              title: "BWG | Dropdown Manager",
              message: "Page Error!",
            });
          });
      }
    }
  }
);

/* POST /dropdownManager/form/:id */
router.post(
  "/:id",
  param("id").matches(/^\d+$/).trim(),
  body("dropdownValue")
    .notEmpty()
    .matches(/^[^%<>^$\/\\;!{}?]+$/)
    .withMessage("Invalid Dropdown Value Entry!")
    .trim(),
  body("dropdownTitle")
    .notEmpty()
    .matches(/^[^%<>^$\/\\;!{}?]+$/)
    .withMessage("Invalid Dropdown Title Entry!")
    .trim(),
  function (req, res, next) {
    // server side validation.
    const errors = validationResult(req);

    // use built-in array() to convert Result object to array for custom error messages.
    var errorArray = errors.array();

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      // render dropdown page with error message.
      return res.render("dropdownManager/form", {
        title: "BWG | Dropdown Manager",
        message: errorArray[0].msg, // custom error message. (should indicate which field has the error.)
        email: req.session.email,
        auth: req.session.auth, // authorization.
        dropdownFormID: req.session.formID,
      });
    } else {
      Dropdown.create({
        dropdownTitle: req.body.dropdownTitle,
        dropdownValue: req.body.dropdownValue,
        isDisabled: 0, // *enable* by default.
        dropdownFormID: req.session.formID,
      })
        .then(() => {
          // save last entered dropdownTitle in the session.
          req.session.lastEnteredDropdownTitle = req.body.dropdownTitle;
          // redirect to same page if successful.
          return res.redirect("/dropdownManager/form/" + req.session.formID);
        })
        .catch((err) => {
          return res.render("dropdownManager/form", {
            title: "BWG | Dropdown Manager",
            message: "Page Error!",
          });
        });
    }
  }
);

/* DISABLE dropdownManager/disable/:id */
router.get(
  "/:id/disable/:id",
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
        auth: req.session.auth, // authorization.
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
        // redirect to same page.
        .then(() => {
          return res.redirect(req.headers.referer);
        })
        .catch((err) => {
          return res.render("dropdownManager/index", {
            title: "BWG | Dropdown Manager",
            message: "Page Error!",
          });
        });
    }
  }
);

/* ENABLE dropdownManager/form/enable/:id */
router.get(
  "/:id/enable/:id",
  param("id").matches(/^\d+$/).trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      // render dropdown page with error message.
      return res.render("dropdownManager/form", {
        title: "BWG | Dropdown Manager",
        message: "Invalid entry!",
        email: req.session.email,
        auth: req.session.auth, // authorization.
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
        // redirect to same page.
        .then(() => {
          return res.redirect(req.headers.referer);
        })
        .catch((err) => {
          return res.render("dropdownManager/form", {
            title: "BWG | Dropdown Manager",
            message: "Page Error!",
          });
        });
    }
  }
);

module.exports = router;
