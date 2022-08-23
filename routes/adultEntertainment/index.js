var express = require("express");
var router = express.Router();
// models.
const Dropdown = require("../../models/dropdownManager/dropdown");
const Business = require("../../models/adultEntertainment/business");
const BusinessAddress = require("../../models/adultEntertainment/businessAddress");
// sequelize.
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
// helper.
const funcHelpers = require("../../config/funcHelpers");
// express-validate.
const { body, param, validationResult } = require("express-validator");
// pagination lib.
const paginate = require("express-paginate");

/* GET /adultEntertainment */
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
      return res.render("adultEntertainment/index", {
        title: "BWG | Adult Entertainment Licenses",
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
          dropdownTitle: "Adult Entertainment Filtering Options",
        },
      });

      // get current date.
      var issueDate = new Date();
      // init expiryDate.
      var modalExpiryDate = new Date();

      // if issueDate is in November or December.
      if (issueDate.getMonth() === 10 || issueDate.getMonth() === 11) {
        modalExpiryDate = new Date(issueDate.getFullYear() + 2, 0, 31);
      } else {
        modalExpiryDate = new Date(issueDate.getFullYear() + 1, 0, 31); // year, month (jan = 0), day
      }

      // if there are no filter parameters.
      if (!req.query.filterCategory || !req.query.filterValue) {
        Business.findAndCountAll({
          limit: req.query.limit,
          offset: req.skip,
          include: [
            {
              model: BusinessAddress,
            },
          ],
        })
          .then((results) => {
            // for pagination.
            const itemCount = results.count;
            const pageCount = Math.ceil(results.count / req.query.limit);

            return res.render("adultEntertainment/index", {
              title: "BWG | Adult Entertainment Licenses",
              message: messages,
              email: req.session.email,
              auth: req.session.auth, // authorization.
              data: results.rows,
              filterOptions: filterOptions,
              modalExpiryDate: modalExpiryDate,
              pageCount,
              itemCount,
              queryCount: "Records returned: " + results.count,
              pages: paginate.getArrayPages(req)(5, pageCount, req.query.page),
              prev: paginate.href(req)(true),
              hasMorePages: paginate.hasNextPages(req)(pageCount),
            });
          })
          .catch((err) => {
            return res.render("adultEntertainment/index", {
              title: "BWG | Adult Entertainment Licenses",
              message: "Page Error!",
            });
          });
      } else if (req.query.filterCategory === "Address") {
        Business.findAndCountAll({
          // functions in where clause, fancy.
          where: Sequelize.where(
            Sequelize.fn(
              "concat",
              Sequelize.col("streetNumber"),
              " ", // have to include the whitespace between. i.e: JohnDoe != John Doe.
              Sequelize.col("streetName")
            ),
            {
              [Op.like]: "%" + req.query.filterValue + "%",
            }
          ),
          include: [
            {
              model: BusinessAddress,
            },
          ],
        })
          .then((results) => {
            // for pagination.
            const itemCount = results.count;
            const pageCount = Math.ceil(results.count / req.query.limit);

            return res.render("adultEntertainment/index", {
              title: "BWG | Adult Entertainment Licenses",
              message: messages,
              email: req.session.email,
              auth: req.session.auth, // authorization.
              data: results.rows,
              filterCategory: req.query.filterCategory,
              filterValue: req.query.filterValue,
              filterOptions: filterOptions,
              modalExpiryDate: modalExpiryDate,
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
            return res.render("adultEntertainment/index", {
              title: "BWG | Adult Entertainment Licenses",
              message: "Page Error!",
            });
          });
      } else {
        // format filterCategory to match column name in db - via handy dandy camelize() function.
        var filterCategory = funcHelpers.camelize(req.query.filterCategory);

        // create filter query.
        Business.findAndCountAll({
          where: {
            [filterCategory]: {
              [Op.like]: req.query.filterValue + "%",
            },
          },
          limit: req.query.limit,
          offset: req.skip,
          include: [
            {
              model: BusinessAddress,
            },
          ],
        })
          .then((results) => {
            // for pagination.
            const itemCount = results.count;
            const pageCount = Math.ceil(results.count / req.query.limit);

            return res.render("adultEntertainment/index", {
              title: "BWG | Adult Entertainment Licenses",
              message: messages,
              email: req.session.email,
              auth: req.session.auth, // authorization.
              data: results.rows,
              filterCategory: req.query.filterCategory,
              filterValue: req.query.filterValue,
              filterOptions: filterOptions,
              modalExpiryDate: modalExpiryDate,
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
            return res.render("adultEntertainment/index", {
              title: "BWG | Adult Entertainment Licenses",
              message: "Page Error!",
            });
          });
      }
    }
  }
);

/* POST /adultEntertainment (renews business) */
router.post("/", async (req, res, next) => {
  // server side validation.
  const errors = validationResult(req);

  // if errors is NOT empty (if there are errors...)
  if (!errors.isEmpty()) {
    return res.render("adultEntertainment/index", {
      title: "BWG | Adult Entertainment Licenses",
      message: "Page Error!",
      email: req.session.email,
      auth: req.session.auth, // authorization.
    });
  } else {
    // get current date for automatic population of license.
    var issueDate = new Date();
    // init expiryDate.
    var expiryDate = new Date();

    // if issueDate is in November or December.
    if (issueDate.getMonth() === 10 || issueDate.getMonth() === 11) {
      expiryDate = new Date(issueDate.getFullYear() + 2, 0, 31);
    } else {
      expiryDate = new Date(issueDate.getFullYear() + 1, 0, 31); // year, month (jan = 0), day
    }

    // no errors, update license.
    Business.update(
      {
        issueDate: issueDate,
        expiryDate: expiryDate,
      },
      {
        where: {
          businessID: req.body.businessID,
        },
      }
    )
      .then(() => {
        return res.redirect("/adultEntertainment");
      })
      .catch((err) => {
        return res.render("adultEntertainment/index", {
          title: "BWG | Adult Entertainment Licenses",
          message: "Page Error!",
        });
      });
  }
});

/* POST /adultEntertainment/history - getting value to search by, then redirect */
router.post(
  "/history",
  body("businessName")
    .if(body("businessName").notEmpty())
    .matches(/^[^%<>^$\/\\;!{}?]+$/)
    .withMessage("Invalid Business Name Entry!")
    .trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...).
    if (!errors.isEmpty()) {
      return res.render("adultEntertainment/index", {
        title: "BWG | Adult Entertainment Licenses",
        message: "Page Error!",
        email: req.session.email,
        auth: req.session.auth, // authorization.
      });
    } else {
      // get the specified business.
      Business.findOne({
        where: {
          businessName: req.body.businessName,
        },
      })
        .then((results) => {
          // redirect to unique history page.
          return res.redirect(
            "/adultEntertainment/businessAddressHistory/" + results.businessID
          );
        }) // catch any scary errors and render page error.
        .catch((err) => {
          return res.render("adultEntertainment/businessAddressHistory", {
            title: "BWG | Business Address History",
            message: "Page Error!",
          });
        });
    }
  }
);

/* GET /adultEntertainment/printLicense/:id */
router.get(
  "/printLicense/:id",
  param("id").matches(/^\d+$/).trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("adultEntertainment/printLicense", {
        title: "BWG | Print License",
        message: "Error!",
        email: req.session.email,
        auth: req.session.auth, // authorization.
      });
    } else {
      // check if there's an error message in the session
      let messages = req.session.messages || [];
      // clear session messages
      req.session.messages = [];

      // get info.
      Business.findOne({
        where: {
          businessID: req.params.id,
        },
        include: [
          {
            model: BusinessAddress,
          },
        ],
      })
        .then((results) => {
          // return endpoint after passing validation.
          return res.render("adultEntertainment/printLicense", {
            title: "BWG | Print License",
            layout: "",
            message: messages,
            email: req.session.email,
            auth: req.session.auth, // authorization.
            // data to populate form with.
            data: {
              ownerName: results.ownerName,
              businessName: results.businessName,
              streetNumber: results.businessAddresses[0].streetNumber,
              streetName: results.businessAddresses[0].streetName,
              town: results.businessAddresses[0].town,
              issueDate: results.issueDate,
              expiryDate: results.expiryDate,
              licenseNumber: results.licenseNumber,
            },
          });
        })
        .catch((err) => {
          return res.render("adultEntertainment/printLicense", {
            title: "BWG | Print License",
            message: "Page Error!",
          });
        });
    }
  }
);

module.exports = router;
