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
// express-validate.
const { body, validationResult } = require("express-validator");
// pagination lib.
const paginate = require("express-paginate");
const e = require("express");

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
      let activeUsers = [];

      // check if response is null or undefined.
      if (activeUsersResponse === null || activeUsersResponse === undefined) {
        return;
      } else {
        // loop through response, grab email and push to an array to use for rendering in HTML.
        for (let i = 0; i < activeUsersResponse.length; i++) {
          let data = JSON.parse(activeUsersResponse[i].data);
          let user = data.email;
          activeUsers.push(user);
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
            });
          });
      } else {
        // get Users.
        User.findAndCountAll({
          limit: req.query.limit,
          offset: req.skip,
          where: {
            email: {
              [Op.like]: "%" + req.query.filterValue + "%",
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
            });
          });
      }
    }
  }
);

module.exports = router;
