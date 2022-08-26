var express = require("express");
var router = express.Router();
// models.
const User = require("../../models/admin/user");
const Dropdown = require("../../models/dropdownManager/dropdown");
// sequelize.
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
// helper.
const dbHelpers = require("../../config/dbHelpers");
const funcHelpers = require("../../config/funcHelpers");
// express-validate.
const { body, validationResult } = require("express-validator");
// pagination lib.
const paginate = require("express-paginate");

/* GET /admin page. */
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
      return res.render("admin/index", {
        title: "BWG | Admin Panel",
        message: "Page Error!",
        auth: req.session.auth, // authorization.
      });
    } else {
      // check if there's an error message in the session.
      let messages = req.session.messages || [];
      // clear session messages.
      req.session.messages = [];

      // get filtering options.
      var filterOptions = await Dropdown.findAll({
        where: {
          dropdownFormID: 29, // filtering options.
          dropdownTitle: "Admin User List Filtering Options",
        },
      });
      // get active users.
      var activeUsersResponse = await dbHelpers.getActiveUsers();
      // make activeUsers of type Set(). Set's only allow for unique values.
      let activeUsers = new Set();

      // check if response is null or undefined.
      if (activeUsersResponse === null || activeUsersResponse === undefined) {
        return;
      } else {
        // loop through response, grab email and push to an array to use for rendering in HTML.
        for (let i = 0; i < activeUsersResponse.length; i++) {
          let data = JSON.parse(activeUsersResponse[i].data);
          let user = data.email;
          // because a Set is used here, only unique values will get added.
          // this is used because a duplicate session can be created if logging in through multiple browsers, among other weird instances/glitches.
          // by using a Set it won't display duplicate values in the list/modal it's shown in.
          activeUsers.add(user);
        }
      }

      // if there are no filter parameters.
      if (!req.query.filterCategory || !req.query.filterValue) {
        // get Users.
        User.findAndCountAll({
          limit: req.query.limit,
          offset: req.skip,
        })
          .then((results) => {
            // for pagination.
            const itemCount = results.count;
            const pageCount = Math.ceil(results.count / req.query.limit);

            return res.render("admin/index", {
              title: "BWG | Admin Panel",
              message: messages,
              email: req.session.email,
              auth: req.session.auth, // authorization.
              data: results.rows,
              filterOptions: filterOptions,
              activeUsers: activeUsers,
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
            return res.render("admin/index", {
              title: "BWG | Admin Panel",
              message: "Page Error!",
              auth: req.session.auth, // authorization.
            });
          });
      } else if (req.query.filterCategory === "Employee Name") {
        // get Users.
        User.findAndCountAll({
          limit: req.query.limit,
          offset: req.skip,
          where: {
            [Op.or]: {
              firstName: {
                [Op.like]: "%" + req.query.filterValue + "%",
              },
              lastName: {
                [Op.like]: "%" + req.query.filterValue + "%",
              },
            },
          },
        })
          .then((results) => {
            // for pagination.
            const itemCount = results.count;
            const pageCount = Math.ceil(results.count / req.query.limit);

            return res.render("admin/index", {
              title: "BWG | Admin Panel",
              message: messages,
              email: req.session.email,
              auth: req.session.auth, // authorization.
              data: results.rows,
              filterOptions: filterOptions,
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
            return res.render("admin/index", {
              title: "BWG | Admin Panel",
              message: "Page Error!",
              auth: req.session.auth, // authorization.
            });
          });
      } else {
        // format filterCategory to match column name in db - via handy dandy camelize() function.
        var filterCategory = funcHelpers.camelize(req.query.filterCategory);

        // create filter query.
        User.findAndCountAll({
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

            return res.render("admin/index", {
              title: "BWG | Admin Panel",
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
            return res.render("admin/index", {
              title: "BWG | Admin Panel",
              message: "Page Error!",
              auth: req.session.auth, // authorization.
            });
          });
      }
    }
  }
);

module.exports = router;
