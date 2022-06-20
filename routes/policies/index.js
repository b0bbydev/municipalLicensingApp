var express = require("express");
var router = express.Router();
const { isLoggedIn } = require("../../config/authHelpers");
// models.
const Dropdown = require("../../models/dropdownManager/dropdown");
const Policy = require("../../models/policies/policy");
const Procedure = require("../../models/policies/procedure");
const Guideline = require("../../models/policies/guideline");
// sequelize.
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
// pagination lib.
const paginate = require("express-paginate");
// express-validate.
const { body, validationResult } = require("express-validator");
// express-rate-limit.
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: "Too many requests! Slow down!",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/* GET /policies */
router.get(
  "/",
  limiter,
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
              title: "BWG | Policies & Procedures",
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
        // format filterCategory to match column name in db.
        switch (req.query.filterCategory) {
          case "Policy ID":
            filterCategory = "policyID";
            break;
          case "Policy Name":
            filterCategory = "policyName";
            break;
          case "Policy Number":
            filterCategory = "policyNumber";
            break;
        }

        // create filter query.
        Policy.findAndCountAll({
          where: {
            [filterCategory]: {
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

            return res.render("policies", {
              title: "BWG | Policies",
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
      }
    }
  }
);

/* GET /policies/policy/:id */
router.get("/policy/:id", limiter, async (req, res, next) => {
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
});

module.exports = router;
