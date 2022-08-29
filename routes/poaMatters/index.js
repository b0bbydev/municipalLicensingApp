var express = require("express");
var router = express.Router();
// models.
const Dropdown = require("../../models/dropdownManager/dropdown");
const POAMatter = require("../../models/poaMatters/poaMatter");
const POAMatterLocation = require("../../models/poaMatters/poaMatterLocation");
const POAMatterTrial = require("../../models/poaMatters/poaMatterTrial");
// sequelize.
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
// helper.
const funcHelpers = require("../../config/funcHelpers");
// express-validate.
const { body, validationResult } = require("express-validator");
// pagination lib.
const paginate = require("express-paginate");

/* GET /poaMatters */
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
      return res.render("poaMatters/index", {
        title: "BWG | POA Matters",
        message: "Page Error!",
        auth: req.session.auth, // authorization.
      });
    } else {
      // check if there's an error message in the session
      let messages = req.session.messages || [];
      // clear session messages
      req.session.messages = [];

      // get filtering options.
      var filterOptions = await Dropdown.findAll({
        where: {
          dropdownFormID: 29, // filtering options.
          dropdownTitle: "POA Matters Filtering Options",
        },
      });

      // get count for POA Matters, results.count displays count including joined tables.
      var poaMatterCount = await POAMatter.findAndCountAll({});

      // if there are no filter parameters.
      if (!req.query.filterCategory || !req.query.filterValue) {
        POAMatter.findAndCountAll({
          limit: req.query.limit,
          offset: req.skip,
          include: [
            {
              model: POAMatterLocation,
            },
            {
              model: POAMatterTrial,
            },
          ],
          order: [["poaMatterID", "DESC"]],
        })
          .then((results) => {
            // for pagination.
            const itemCount = results.count;
            const pageCount = Math.ceil(results.count / req.query.limit);

            return res.render("poaMatters/index", {
              title: "BWG | POA Matters",
              message: messages,
              email: req.session.email,
              auth: req.session.auth, // authorization.
              data: results.rows,
              filterOptions: filterOptions,
              currentPage: req.query.page,
              pageCount,
              itemCount,
              queryCount: "Records returned: " + poaMatterCount.count,
              pages: paginate.getArrayPages(req)(5, pageCount, req.query.page),
              prev: paginate.href(req)(true),
              hasMorePages: paginate.hasNextPages(req)(pageCount),
            });
          })
          // catch any scary errors and render page error.
          .catch((err) => {
            return res.render("poaMatters/index", {
              title: "BWG | POA Matters",
              message: "Page Error!",
              auth: req.session.auth, // authorization.
            });
          });
      } else {
        // format filterCategory to match column name in db - via handy dandy camelize() function.
        var filterCategory = funcHelpers.camelize(req.query.filterCategory);

        POAMatter.findAndCountAll({
          where: {
            [filterCategory]: {
              [Op.like]: "%" + req.query.filterValue + "%",
            },
          },
          limit: req.query.limit,
          offset: req.skip,
          include: [
            {
              model: POAMatterLocation,
            },
            {
              model: POAMatterTrial,
            },
          ],
        })
          .then((results) => {
            // for pagination.
            const itemCount = results.count;
            const pageCount = Math.ceil(results.count / req.query.limit);

            return res.render("poaMatters/index", {
              title: "BWG | POA Matters",
              message: messages,
              email: req.session.email,
              auth: req.session.auth, // authorization.
              data: results.rows,
              filterOptions: filterOptions,
              filterCategory: req.query.filterCategory,
              filterValue: req.query.filterValue,
              currentPage: req.query.page,
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
            return res.render("poaMatters/index", {
              title: "BWG | POA Matters",
              message: "Page Error!",
              auth: req.session.auth, // authorization.
            });
          });
      }
    }
  }
);

module.exports = router;
