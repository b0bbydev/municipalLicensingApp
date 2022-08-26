var express = require("express");
var router = express.Router();
// models.
const Dropdown = require("../../models/dropdownManager/dropdown");
const Guideline = require("../../models/policies/guideline");
const GuidelineHistory = require("../../models/policies/guidelineHistory");
const Policy = require("../../models/policies/policy");
// sequelize.
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
// helper.
const funcHelpers = require("../../config/funcHelpers");
// pagination lib.
const paginate = require("express-paginate");
// express-validate.
const { body, param, validationResult } = require("express-validator");

/* GET /policies/guidelines page. */
router.get("/", async (req, res, next) => {
  // check if there's an error message in the session
  let messages = req.session.messages || [];
  // clear session messages
  req.session.messages = [];

  // get filter options.
  var filterOptions = await Dropdown.findAll({
    where: {
      dropdownFormID: 29, // filtering options.
      dropdownTitle: "Guideline Filtering Options",
    },
  });

  // get all policies.
  var policies = await Policy.findAll();

  // if there are no filter parameters.
  if (!req.query.filterCategory || !req.query.filterValue) {
    Guideline.findAndCountAll({
      limit: req.query.limit,
      offset: req.skip,
      where: {
        policyID: {
          [Op.eq]: null, // where policyID is null.
        },
      },
    })
      .then((results) => {
        // for pagination.
        const itemCount = results.count;
        const pageCount = Math.ceil(results.count / req.query.limit);

        return res.render("policies/guidelines", {
          title: "BWG | Guidelines",
          message: messages,
          email: req.session.email,
          auth: req.session.auth, // authorization.
          data: results.rows,
          filterOptions: filterOptions,
          policies: policies,
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
        return res.render("policies/guidelines", {
          title: "BWG | Guidelines",
          message: "Page Error!",
          auth: req.session.auth, // authorization.
        });
      });
  } else {
    // format filterCategory to match column name in db - via handy dandy camelize() function.
    var filterCategory = funcHelpers.camelize(req.query.filterCategory);

    // create filter query.
    Guideline.findAndCountAll({
      where: {
        [filterCategory]: {
          [Op.like]: "%" + req.query.filterValue + "%",
        },
        [Op.and]: {
          policyID: {
            [Op.eq]: null, // where policyID is null.
          },
        },
      },
      limit: req.query.limit,
      offset: req.skip,
    })
      .then((results) => {
        // for pagination.
        const itemCount = results.count;
        const pageCount = Math.ceil(results.count / req.query.limit);

        return res.render("policies/guidelines", {
          title: "BWG | Guidelines",
          message: messages,
          email: req.session.email,
          auth: req.session.auth, // authorization.
          data: results.rows,
          filterCategory: req.query.filterCategory,
          filterValue: req.query.filterValue,
          filterOptions: filterOptions,
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
        return res.render("policies/guidelines", {
          title: "BWG | Guidelines",
          message: "Page Error!",
          auth: req.session.auth, // authorization.
        });
      });
  }
});

/* POST /policies/guidelines */
router.post(
  "/",
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
      return res.render("policies/guidelines", {
        title: "BWG | Guidelines",
        message: "Page Error!",
        email: req.session.email,
        auth: req.session.auth, // authorization.
      });
    } else {
      // get the specified policy based on name.
      Policy.findOne({
        attributes: ["policyID"],
        where: {
          policyName: req.body.policyName,
        },
      })
        .then((results) => {
          policyID = results.policyID;
        })
        .then(() => {
          Guideline.update(
            {
              policyID: policyID,
            },
            {
              where: {
                guidelineID: req.body.guidelineID,
              },
            }
          );
        })
        .then(() => {
          return res.redirect("/policies/guidelines");
        })
        // catch any scary errors and render page error.
        .catch((err) => {
          return res.render("policies/guidelines", {
            title: "BWG | Guidelines",
            message: "Page Error!",
            auth: req.session.auth, // authorization.
          });
        });
    }
  }
);

/* GET /policies/guidelines/guidelineHistory/:id */
router.get(
  "/guidelineHistory/:id",
  param("id").matches(/^\d+$/).trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("policies/guidelineHistory", {
        title: "BWG | Guideline History",
        message: "Page Error!",
        email: req.session.email,
        auth: req.session.auth, // authorization.
      });
    } else {
      // check if there's an error message in the session
      let messages = req.session.messages || [];
      // clear session messages
      req.session.messages = [];

      // get month dropdown values.
      var monthDropdownValues = await Dropdown.findAll({
        where: {
          dropdownFormID: 29, // filtering options.
          dropdownTitle: "Policy History Filtering Options - Months",
        },
      });
      // get month dropdown values.
      var yearDropdownValues = await Dropdown.findAll({
        where: {
          dropdownFormID: 29, // filtering options.
          dropdownTitle: "Policy History Filtering Options - Years",
        },
      });

      // if there are no filter parameters.
      if (!req.query.filterMonth && !req.query.filterYear) {
        GuidelineHistory.findAndCountAll({
          where: {
            [Op.and]: {
              guidelineID: req.params.id,
              policyID: null,
            },
          },
          order: [["lastModified", "DESC"]],
        })
          .then((results) => {
            return res.render("policies/guidelineHistory", {
              title: "BWG | Guideline History",
              message: messages,
              email: req.session.email,
              auth: req.session.auth, // authorization.
              data: results.rows,
              guidelineID: req.params.id,
              monthDropdownValues: monthDropdownValues,
              yearDropdownValues: yearDropdownValues,
            });
          })
          .catch((err) => {
            return res.render("policies/guidelineHistory", {
              title: "BWG | Guideline History",
              message: "Page Error!",
              auth: req.session.auth, // authorization.
            });
          });
        // both year and month filter.
      } else if (req.query.filterMonth && req.query.filterYear) {
        GuidelineHistory.findAndCountAll({
          where: {
            [Op.and]: [
              { guidelineID: req.params.id },
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
          order: [["lastModified", "DESC"]],
        })
          .then((results) => {
            return res.render("policies/guidelineHistory", {
              title: "BWG | Guideline History",
              message: messages,
              email: req.session.email,
              auth: req.session.auth, // authorization.
              monthDropdownValues: monthDropdownValues,
              yearDropdownValues: yearDropdownValues,
              data: results.rows,
              guidelineID: req.params.id,
              filterMonth: req.query.filterMonth,
              filterYear: req.query.filterYear,
            });
          })
          .catch((err) => {
            return res.render("policies/guidelineHistory", {
              title: "BWG | Guideline History",
              message: "Page Error!",
              auth: req.session.auth, // authorization.
            });
          });
        // if at least one filter exists.
      } else if (req.query.filterMonth || req.query.filterYear) {
        /* IF ONLY YEAR. */
        if (!req.query.filterMonth) {
          GuidelineHistory.findAndCountAll({
            where: {
              // where guidelineID = req.params.id AND year(lastModifed) = req.query.filterYear.
              [Op.and]: [
                { guidelineID: req.params.id },
                Sequelize.where(
                  Sequelize.fn("year", Sequelize.col("lastModified")),
                  [req.query.filterYear]
                ),
              ],
            },
            order: [["lastModified", "DESC"]],
          })
            .then((results) => {
              return res.render("policies/guidelineHistory", {
                title: "BWG | Guideline History",
                message: messages,
                email: req.session.email,
                auth: req.session.auth, // authorization.
                monthDropdownValues: monthDropdownValues,
                yearDropdownValues: yearDropdownValues,
                data: results.rows,
                guidelineID: req.params.id,
                filterMonth: req.query.filterMonth,
                filterYear: req.query.filterYear,
              });
            })
            .catch((err) => {
              return res.render("policies/guidelineHistory", {
                title: "BWG | Guideline History",
                message: "Page Error!",
                auth: req.session.auth, // authorization.
              });
            });
          /* IF ONLY MONTH. */
        } else if (!req.query.filterYear) {
          GuidelineHistory.findAndCountAll({
            where: {
              // where guidelineID = req.params.id AND year(lastModifed) = req.query.filterYear.
              [Op.and]: [
                { guidelineID: req.params.id },
                Sequelize.where(
                  Sequelize.fn("month", Sequelize.col("lastModified")),
                  [funcHelpers.monthToNumber(req.query.filterMonth)]
                ),
              ],
            },
            order: [["lastModified", "DESC"]],
          })
            .then((results) => {
              return res.render("policies/guidelineHistory", {
                title: "BWG | Guideline History",
                message: messages,
                email: req.session.email,
                auth: req.session.auth, // authorization.
                monthDropdownValues: monthDropdownValues,
                yearDropdownValues: yearDropdownValues,
                data: results.rows,
                guidelineID: req.params.id,
                filterMonth: req.query.filterMonth,
                filterYear: req.query.filterYear,
              });
            })
            .catch((err) => {
              return res.render("policies/guidelineHistory", {
                title: "BWG | Guideline History",
                message: "Page Error!",
                auth: req.session.auth, // authorization.
              });
            });
        }
      }
    }
  }
);

module.exports = router;
