var express = require("express");
var router = express.Router();
const { isLoggedIn } = require("../../config/authHelpers");
// models.
const Dropdown = require("../../models/dropdownManager/dropdown");
const Policy = require("../../models/policies/policy");
const PolicyHistory = require("../../models/policies/policyHistory");
const Procedure = require("../../models/policies/procedure");
const Guideline = require("../../models/policies/guideline");
// helpers.
const funcHelpers = require("../../config/funcHelpers");
// sequelize.
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
// pagination lib.
const paginate = require("express-paginate");
// express-validate.
const { body, param, validationResult } = require("express-validator");
// request limiter.
const limiter = require("../../config/limiter");
const sequelize = require("sequelize");

/* GET /policies */
router.get(
  "/",
  limiter,
  isLoggedIn,
  body("filterCategory")
    .matches(/^[^'";=_()*&%$#!<>\/\^\\]*$/)
    .trim(),
  body("filterValue")
    .matches(/^[^'";=_()*&%$#!<>\/\^\\]*$/)
    .trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("dogtags", {
        title: "BWG | Dogtags",
        message: "Page Error!",
      });
    } else {
      // check if there's an error message in the session
      let messages = req.session.messages || [];
      // clear session messages
      req.session.messages = [];
      // delete session lastEnteredDropdownTitle.
      delete req.session.lastEnteredDropdownTitle;

      // get dropdown values.
      var dropdownValues = await Dropdown.findAll({
        where: {
          dropdownFormID: 2,
        },
      });

      // if there are no filter parameters.
      if (!req.query.filterCategory || !req.query.filterValue) {
        // get all the policies.
        Policy.findAndCountAll({ limit: req.query.limit, offset: req.skip })
          .then((results) => {
            // for pagination.
            const itemCount = results.count;
            const pageCount = Math.ceil(results.count / req.query.limit);

            return res.render("policies", {
              title: "BWG | Policies",
              errorMessages: messages,
              email: req.session.email,
              dogAuth: req.session.dogAuth,
              admin: req.session.admin,
              data: results.rows,
              dropdownValues: dropdownValues,
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
            res.render("policies", {
              title: "BWG | Policies",
              message: "Page Error! ",
            })
          );
      } else {
        // format filterCategory to match column name in db - via handy dandy camelize() function.
        var filterCategory = funcHelpers.camelize(req.query.filterCategory);

        // create filter query.
        Policy.findAndCountAll({
          where: {
            [filterCategory]: {
              [Op.like]: "%" + req.query.filterValue + "%",
            },
          },
          limit: req.query.limit,
          offset: req.skip,
        })
          .then((results) => {
            // for pagination.
            const itemCount = results.count;
            const pageCount = Math.ceil(results.count / req.query.limit);

            return res.render("policies", {
              title: "BWG | Policies",
              email: req.session.email,
              dogAuth: req.session.dogAuth,
              admin: req.session.admin,
              data: results.rows,
              filterCategory: req.query.filterCategory,
              filterValue: req.query.filterValue,
              dropdownValues: dropdownValues,
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
            res.render("policies", {
              title: "BWG | Policies",
              message: "Page Error! ",
            })
          );
      }
    }
  }
);

/* POST /policies */
router.post(
  "/",
  limiter,
  body("policyName")
    .if(body("policyName").notEmpty())
    .matches(/^[a-zA-Z0-9\/\-. ]*$/)
    .withMessage("Invalid Policy Name Entry!")
    .trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...).
    if (!errors.isEmpty()) {
      return res.render("policies", {
        title: "BWG | Policies",
        message: "Page Error!",
        email: req.session.email,
        dogAuth: req.session.dogAuth,
        admin: req.session.admin,
      });
    } else {
      // get the specified policy based on name.
      Policy.findOne({
        where: {
          policyName: req.body.policyName,
        },
      }).then((results) => {
        // redirect to unique policyHistory page.
        return res.redirect("/policies/policyHistory/" + results.policyID);
      });
    }
  }
);

/* GET /policies/policy/:id */
router.get(
  "/policy/:id",
  param("id").matches(/^\d+$/).trim(),
  limiter,
  async (req, res, next) => {
    // check if there's an error message in the session
    let messages = req.session.messages || [];
    // clear session messages
    req.session.messages = [];

    // get related procedures.
    let procedures = await Procedure.findAll({
      where: {
        policyID: req.params.id, // policyID is in URL bar.
      },
    });
    // get related guidelines.
    let guidelines = await Guideline.findAll({
      where: {
        policyID: req.params.id, // policyID is in URL bar.
      },
    });
    // get current policyName.
    let policyName = await Policy.findOne({
      where: {
        policyID: req.params.id,
      },
    });

    return res.render("policies/policy", {
      title: "BWG | Policy",
      errorMessages: messages,
      email: req.session.email,
      dogAuth: req.session.dogAuth,
      admin: req.session.admin,
      procedures: procedures,
      guidelines: guidelines,
      policyName: policyName.policyName,
    });
  }
);

/* GET /policies/policyHistory/:id */
router.get(
  "/policyHistory/:id",
  param("id").matches(/^\d+$/).trim(),
  limiter,
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("policies/policyHistory", {
        title: "BWG | Policy History",
        message: "Page Error!",
      });
    } else {
      // check if there's an error message in the session
      let messages = req.session.messages || [];
      // clear session messages
      req.session.messages = [];

      // get month dropdown values.
      var monthDropdownValues = await Dropdown.findAll({
        where: {
          dropdownFormID: 14,
          dropdownTitle: "Months",
        },
      });
      // get month dropdown values.
      var yearDropdownValues = await Dropdown.findAll({
        where: {
          dropdownFormID: 14,
          dropdownTitle: "Years",
        },
      });
      // get policy name.
      PolicyHistory.findOne({
        attributes: ["policyName"],
        where: {
          policyID: req.session.policyID,
        },
      }).then((results) => {
        // create policyName from results.
        policyName = results.policyName;
      });

      // if there are no filter parameters.
      if (!req.query.filterMonth && !req.query.filterYear) {
        PolicyHistory.findAndCountAll({
          limit: req.query.limit,
          offset: req.skip,
        })
          .then((results) => {
            // for pagination.
            const itemCount = results.count;
            const pageCount = Math.ceil(results.count / req.query.limit);

            return res.render("policies/policyHistory", {
              title: "BWG | Policy History",
              errorMessages: messages,
              email: req.session.email,
              dogAuth: req.session.dogAuth, // authorization.
              admin: req.session.admin, // authorization.
              policyHistory: results.rows,
              policyName: policyName,
              policyID: req.session.policyID,
              monthDropdownValues: monthDropdownValues,
              yearDropdownValues: yearDropdownValues,
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
            res.render("policies/policyHistory", {
              title: "BWG | Policy History",
              message: "Page Error! ",
            })
          );
        // if at least one exists.
      } else if (req.query.filterMonth || req.query.filterYear) {
        /* IF ONLY YEAR. */
        if (!req.query.filterMonth) {
          PolicyHistory.findAndCountAll({
            where: Sequelize.where(
              Sequelize.fn("year", Sequelize.col("lastModified")),
              [req.query.filterYear]
            ),
            limit: req.query.limit,
            offset: req.skip,
          }).then((results) => {
            // for pagination.
            const itemCount = results.count;
            const pageCount = Math.ceil(results.count / req.query.limit);

            return res.render("policies/policyHistory", {
              title: "BWG | Policy History",
              errorMessages: messages,
              email: req.session.email,
              dogAuth: req.session.dogAuth,
              admin: req.session.admin,
              policyHistory: results.rows,
              policyName: policyName,
              policyID: req.session.policyID,
              monthDropdownValues: monthDropdownValues,
              yearDropdownValues: yearDropdownValues,
              filterMonth: req.query.filterMonth,
              filterYear: req.query.filterYear,
              pageCount,
              itemCount,
              queryCount: "Records returned: " + results.count,
              pages: paginate.getArrayPages(req)(5, pageCount, req.query.page),
              prev: paginate.href(req)(true),
              hasMorePages: paginate.hasNextPages(req)(pageCount),
            });
          });
          /* IF ONLY MONTH. */
        } else if (!req.query.filterYear) {
          PolicyHistory.findAndCountAll({
            where: Sequelize.where(
              Sequelize.fn("month", Sequelize.col("lastModified")),
              [funcHelpers.monthToNumber(req.query.filterMonth)]
            ),
            limit: req.query.limit,
            offset: req.skip,
          }).then((results) => {
            // for pagination.
            const itemCount = results.count;
            const pageCount = Math.ceil(results.count / req.query.limit);

            return res.render("policies/policyHistory", {
              title: "BWG | Policy History",
              errorMessages: messages,
              email: req.session.email,
              dogAuth: req.session.dogAuth,
              admin: req.session.admin,
              policyHistory: results.rows,
              policyName: policyName,
              policyID: req.session.policyID,
              monthDropdownValues: monthDropdownValues,
              yearDropdownValues: yearDropdownValues,
              filterMonth: req.query.filterMonth,
              filterYear: req.query.filterYear,
              pageCount,
              itemCount,
              queryCount: "Records returned: " + results.count,
              pages: paginate.getArrayPages(req)(5, pageCount, req.query.page),
              prev: paginate.href(req)(true),
              hasMorePages: paginate.hasNextPages(req)(pageCount),
            });
          });
          // if both month and year filter provided.
        } else if (req.query.filterMonth && req.query.filterYear) {
          PolicyHistory.findAndCountAll({
            where: {
              [Op.and]: [
                Sequelize.where(
                  Sequelize.fn("year", Sequelize.col("lastModified")),
                  [req.query.filterYear]
                ),
                Sequelize.where(
                  Sequelize.fn("month", Sequelize.col("lastModified")),
                  [funcHelpers.monthToNumber(req.query.filterMonth)]
                ),
              ],
            },
          }).then((results) => {
            // for pagination.
            const itemCount = results.count;
            const pageCount = Math.ceil(results.count / req.query.limit);

            return res.render("policies/policyHistory", {
              title: "BWG | Policy History",
              errorMessages: messages,
              email: req.session.email,
              dogAuth: req.session.dogAuth,
              admin: req.session.admin,
              policyHistory: results.rows,
              policyName: policyName,
              policyID: req.session.policyID,
              monthDropdownValues: monthDropdownValues,
              yearDropdownValues: yearDropdownValues,
              filterMonth: req.query.filterMonth,
              filterYear: req.query.filterYear,
              pageCount,
              itemCount,
              queryCount: "Records returned: " + results.count,
              pages: paginate.getArrayPages(req)(5, pageCount, req.query.page),
              prev: paginate.href(req)(true),
              hasMorePages: paginate.hasNextPages(req)(pageCount),
            });
          });
        }
      }
    }
  }
);

module.exports = router;
