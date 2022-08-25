var express = require("express");
var router = express.Router();
// models.
const Dropdown = require("../../models/dropdownManager/dropdown");
const Policy = require("../../models/policies/policy");
const PolicyHistory = require("../../models/policies/policyHistory");
const Procedure = require("../../models/policies/procedure");
const ProcedureHistory = require("../../models/policies/procedureHistory");
const Guideline = require("../../models/policies/guideline");
const GuidelineHistory = require("../../models/policies/guidelineHistory");
// helpers.
const funcHelpers = require("../../config/funcHelpers");
// sequelize.
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
// pagination lib.
const paginate = require("express-paginate");
// express-validate.
const { body, param, validationResult } = require("express-validator");

/* GET /policies */
router.get(
  "/",
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
      return res.render("policies/index", {
        title: "BWG | Policies",
        message: "Page Error!",
        email: req.session.email,
        auth: req.session.auth, // authorization.
      });
    } else {
      // check if there's an error message in the session
      let messages = req.session.messages || [];
      // clear session messages
      req.session.messages = [];
      // delete session lastEnteredDropdownTitle.
      delete req.session.lastEnteredDropdownTitle;

      // get filtering options.
      var filterOptions = await Dropdown.findAll({
        where: {
          dropdownFormID: 29, // filtering options.
          dropdownTitle: "Policy Filtering Options",
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

            return res.render("policies/index", {
              title: "BWG | Policies",
              message: messages,
              email: req.session.email,
              auth: req.session.auth, // authorization.
              data: results.rows,
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
            return res.render("policies/index", {
              title: "BWG | Policies",
              message: "Page Error!",
            });
          });
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

            return res.render("policies/index", {
              title: "BWG | Policies",
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
            return res.render("policies/index", {
              title: "BWG | Policies",
              message: "Page Error!",
            });
          });
      }
    }
  }
);

/* POST /policies - getting value to search by, then redirect */
router.post(
  "/",
  body("policyName")
    .if(body("policyName").notEmpty())
    .matches(/^[^%<>^$\\;!{}?]+$/)
    .withMessage("Invalid Policy Name Entry!")
    .trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...).
    if (!errors.isEmpty()) {
      return res.render("policies/index", {
        title: "BWG | Policies",
        message: "Page Error!",
        email: req.session.email,
        auth: req.session.auth, // authorization.
      });
    } else {
      // get the specified policy based on name.
      Policy.findOne({
        where: {
          policyName: req.body.policyName,
        },
      })
        .then((results) => {
          // redirect to unique policyHistory page.
          return res.redirect("/policies/policyHistory/" + results.policyID);
        })
        // catch any scary errors and render page error.
        .catch((err) => {
          return res.render("policies/index", {
            title: "BWG | Policies",
            message: "Page Error!",
          });
        });
    }
  }
);

/* GET /policies/policy/:id */
router.get(
  "/policy/:id",
  param("id").matches(/^\d+$/).trim(),
  async (req, res, next) => {
    // check if there's an error message in the session
    let messages = req.session.messages || [];
    // clear session messages
    req.session.messages = [];

    // save policyID to session.
    req.session.policyID = req.params.id;

    // get related procedures.
    let procedures = await Procedure.findAll({
      where: {
        policyID: req.session.policyID, // policyID is in URL bar.
      },
    });
    // get related guidelines.
    let guidelines = await Guideline.findAll({
      where: {
        policyID: req.session.policyID, // policyID is in URL bar.
      },
    });
    // get current policyName and notes.
    let policyInfo = await Policy.findOne({
      attributes: ["policyName", "notes"],
      where: {
        policyID: req.session.policyID,
      },
    });

    return res.render("policies/policy", {
      title: "BWG | Policy",
      message: messages,
      email: req.session.email,
      auth: req.session.auth, // authorization.
      procedures: procedures,
      guidelines: guidelines,
      policyInfo: policyInfo,
      policyID: req.session.policyID,
    });
  }
);

/* GET /policies/policyHistory/:id */
router.get(
  "/policyHistory/:id",
  param("id").matches(/^\d+$/).trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("policies/policyHistory", {
        title: "BWG | Policy History",
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

      // get policy name.
      Policy.findOne({
        attributes: ["policyName"],
        where: {
          policyID: req.params.id,
        },
      })
        .then((results) => {
          policyName = results.policyName;
        })
        .catch((err) => {
          return res.render("policies/policyHistory", {
            title: "BWG | Policy History",
            message: "Page Error!",
          });
        });

      // if there are no filter parameters.
      if (!req.query.filterMonth && !req.query.filterYear) {
        PolicyHistory.findAndCountAll({
          limit: req.query.limit,
          offset: req.skip,
          where: {
            policyID: req.params.id,
          },
          order: [["lastModified", "DESC"]],
        }).then((policyHistory) => {
          GuidelineHistory.findAndCountAll({
            limit: req.query.limit,
            offset: req.skip,
            where: {
              policyID: req.params.id,
            },
            order: [["lastModified", "DESC"]],
          }).then((guidelineHistory) => {
            ProcedureHistory.findAndCountAll({
              limit: req.query.limit,
              offset: req.skip,
              where: {
                policyID: req.params.id,
              },
              order: [["lastModified", "DESC"]],
            })
              .then((procedureHistory) => {
                // for pagination.
                const itemCount = policyHistory.count;
                const pageCount = Math.ceil(
                  policyHistory.count / req.query.limit
                );

                return res.render("policies/policyHistory", {
                  title: "BWG | Policy History",
                  message: messages,
                  email: req.session.email,
                  auth: req.session.auth, // authorization.
                  policyHistory: policyHistory.rows,
                  policyName: policyName,
                  procedureHistory: procedureHistory.rows,
                  guidelineHistory: guidelineHistory.rows,
                  policyID: req.params.id,
                  monthDropdownValues: monthDropdownValues,
                  yearDropdownValues: yearDropdownValues,
                  pageCount,
                  itemCount,
                  queryCount: "Records returned: " + policyHistory.count,
                  pages: paginate.getArrayPages(req)(
                    5,
                    pageCount,
                    req.query.page
                  ),
                  prev: paginate.href(req)(true),
                  hasMorePages: paginate.hasNextPages(req)(pageCount),
                });
              })
              // catch any scary errors and render page error.
              .catch((err) => {
                return res.render("policies/policyHistory", {
                  title: "BWG | Policy History",
                  message: "Page Error!",
                });
              });
          });
        });
        // if at least one filter exists.
      } else if (req.query.filterMonth || req.query.filterYear) {
        /* IF ONLY YEAR. */
        if (!req.query.filterMonth) {
          // get procedure history.
          ProcedureHistory.findAndCountAll({
            where: {
              // where policyID = req.params.id AND year(lastModifed) = req.query.filterYear.
              [Op.and]: [
                { policyID: req.params.id },
                Sequelize.where(
                  Sequelize.fn("year", Sequelize.col("lastModified")),
                  [req.query.filterYear]
                ),
              ],
            },
            limit: req.query.limit,
            offset: req.skip,
            order: [["lastModified", "DESC"]],
          }).then((procedureHistory) => {
            // get guideline history.
            GuidelineHistory.findAndCountAll({
              where: {
                // where policyID = req.params.id AND year(lastModifed) = req.query.filterYear.
                [Op.and]: [
                  { policyID: req.params.id },
                  Sequelize.where(
                    Sequelize.fn("year", Sequelize.col("lastModified")),
                    [req.query.filterYear]
                  ),
                ],
              },
              limit: req.query.limit,
              offset: req.skip,
              order: [["lastModified", "DESC"]],
            }).then((guidelineHistory) => {
              // get policy history.
              PolicyHistory.findAndCountAll({
                where: {
                  // where policyID = req.params.id AND year(lastModifed) = req.query.filterYear.
                  [Op.and]: [
                    { policyID: req.params.id },
                    Sequelize.where(
                      Sequelize.fn("year", Sequelize.col("lastModified")),
                      [req.query.filterYear]
                    ),
                  ],
                },
                limit: req.query.limit,
                offset: req.skip,
                order: [["lastModified", "DESC"]],
              })
                .then((policyHistory) => {
                  // for pagination.
                  const itemCount = policyHistory.count;
                  const pageCount = Math.ceil(
                    policyHistory.count / req.query.limit
                  );

                  return res.render("policies/policyHistory", {
                    title: "BWG | Policy History",
                    message: messages,
                    email: req.session.email,
                    auth: req.session.auth, // authorization.
                    policyHistory: policyHistory.rows,
                    policyName: policyName,
                    procedureHistory: procedureHistory.rows,
                    guidelineHistory: guidelineHistory.rows,
                    policyID: req.params.id,
                    monthDropdownValues: monthDropdownValues,
                    yearDropdownValues: yearDropdownValues,
                    filterMonth: req.query.filterMonth,
                    filterYear: req.query.filterYear,
                    pageCount,
                    itemCount,
                    queryCount: "Records returned: " + policyHistory.count,
                    pages: paginate.getArrayPages(req)(
                      5,
                      pageCount,
                      req.query.page
                    ),
                    prev: paginate.href(req)(true),
                    hasMorePages: paginate.hasNextPages(req)(pageCount),
                  });
                })
                // catch any scary errors and render page error.
                .catch((err) => {
                  return res.render("policies/policyHistory", {
                    title: "BWG | Policy History",
                    message: "Page Error!",
                  });
                });
            });
          });
          /* IF ONLY MONTH. */
        } else if (!req.query.filterYear) {
          // get procedure history.
          ProcedureHistory.findAndCountAll({
            where: {
              // where policyID = req.params.id AND month(lastModifed) = req.query.filterMonth.
              [Op.and]: [
                { policyID: req.params.id },
                Sequelize.where(
                  Sequelize.fn("month", Sequelize.col("lastModified")),
                  [funcHelpers.monthToNumber(req.query.filterMonth)]
                ),
              ],
            },
            limit: req.query.limit,
            offset: req.skip,
            order: [["lastModified", "DESC"]],
          }).then((procedureHistory) => {
            // get guideline history.
            GuidelineHistory.findAndCountAll({
              where: {
                // where policyID = req.params.id AND month(lastModifed) = req.query.filterMonth.
                [Op.and]: [
                  { policyID: req.params.id },
                  Sequelize.where(
                    Sequelize.fn("month", Sequelize.col("lastModified")),
                    [funcHelpers.monthToNumber(req.query.filterMonth)]
                  ),
                ],
              },
              limit: req.query.limit,
              offset: req.skip,
              order: [["lastModified", "DESC"]],
            }).then((guidelineHistory) => {
              // get policy history.
              PolicyHistory.findAndCountAll({
                where: {
                  // where policyID = req.params.id AND month(lastModifed) = req.query.filterMonth.
                  [Op.and]: [
                    { policyID: req.params.id },
                    Sequelize.where(
                      Sequelize.fn("month", Sequelize.col("lastModified")),
                      [funcHelpers.monthToNumber(req.query.filterMonth)]
                    ),
                  ],
                },
                limit: req.query.limit,
                offset: req.skip,
                order: [["lastModified", "DESC"]],
              })
                .then((policyHistory) => {
                  // for pagination.
                  const itemCount = policyHistory.count;
                  const pageCount = Math.ceil(
                    policyHistory.count / req.query.limit
                  );

                  return res.render("policies/policyHistory", {
                    title: "BWG | Policy History",
                    message: messages,
                    email: req.session.email,
                    auth: req.session.auth, // authorization.
                    policyHistory: policyHistory.rows,
                    policyName: policyName,
                    procedureHistory: procedureHistory.rows,
                    guidelineHistory: guidelineHistory.rows,
                    policyID: req.params.id,
                    monthDropdownValues: monthDropdownValues,
                    yearDropdownValues: yearDropdownValues,
                    filterMonth: req.query.filterMonth,
                    filterYear: req.query.filterYear,
                    pageCount,
                    itemCount,
                    queryCount: "Records returned: " + policyHistory.count,
                    pages: paginate.getArrayPages(req)(
                      5,
                      pageCount,
                      req.query.page
                    ),
                    prev: paginate.href(req)(true),
                    hasMorePages: paginate.hasNextPages(req)(pageCount),
                  });
                })
                // catch any scary errors and render page error.
                .catch((err) => {
                  return res.render("policies/policyHistory", {
                    title: "BWG | Policy History",
                    message: "Page Error!",
                  });
                });
            });
          });
          // if both month and year filter provided.
        } else if (req.query.filterMonth && req.query.filterYear) {
          // get procedure history.
          ProcedureHistory.findAndCountAll({
            where: {
              [Op.and]: [
                { policyID: req.params.id },
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
            limit: req.query.limit,
            offset: req.skip,
            order: [["lastModified", "DESC"]],
          }).then((procedureHistory) => {
            // get guideline history.
            GuidelineHistory.findAndCountAll({
              where: {
                [Op.and]: [
                  { policyID: req.params.id },
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
              limit: req.query.limit,
              offset: req.skip,
              order: [["lastModified", "DESC"]],
            }).then((guidelineHistory) => {
              // get policy history.
              PolicyHistory.findAndCountAll({
                where: {
                  [Op.and]: [
                    { policyID: req.params.id },
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
                limit: req.query.limit,
                offset: req.skip,
                order: [["lastModified", "DESC"]],
              })
                .then((policyHistory) => {
                  // for pagination.
                  const itemCount = policyHistory.count;
                  const pageCount = Math.ceil(
                    policyHistory.count / req.query.limit
                  );

                  return res.render("policies/policyHistory", {
                    title: "BWG | Policy History",
                    message: messages,
                    email: req.session.email,
                    auth: req.session.auth, // authorization.
                    policyHistory: policyHistory.rows,
                    policyName: policyName,
                    procedureHistory: procedureHistory.rows,
                    guidelineHistory: guidelineHistory.rows,
                    policyID: req.params.id,
                    monthDropdownValues: monthDropdownValues,
                    yearDropdownValues: yearDropdownValues,
                    filterMonth: req.query.filterMonth,
                    filterYear: req.query.filterYear,
                    pageCount,
                    itemCount,
                    queryCount: "Records returned: " + policyHistory.count,
                    pages: paginate.getArrayPages(req)(
                      5,
                      pageCount,
                      req.query.page
                    ),
                    prev: paginate.href(req)(true),
                    hasMorePages: paginate.hasNextPages(req)(pageCount),
                  });
                })
                // catch any scary errors and render page error.
                .catch((err) => {
                  return res.render("policies/policyHistory", {
                    title: "BWG | Policy History",
                    message: "Page Error!",
                  });
                });
            });
          });
        }
      }
    }
  }
);

module.exports = router;
