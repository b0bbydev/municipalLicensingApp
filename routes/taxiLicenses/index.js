var express = require("express");
var router = express.Router();
// models.
const Dropdown = require("../../models/dropdownManager/dropdown");
const TaxiBroker = require("../../models/taxiLicenses/taxiBroker");
const TaxiBrokerAddress = require("../../models/taxiLicenses/taxiBrokerAddress");
// sequelize.
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
// helper.
const funcHelpers = require("../../config/funcHelpers");
// pagination lib.
const paginate = require("express-paginate");
// express-validate.
const { body, validationResult } = require("express-validator");

/* GET /taxiLicenses */
router.get("/", async (req, res, next) => {
  // check if there's an error message in the session
  let messages = req.session.messages || [];
  // clear session messages
  req.session.messages = [];

  // get filtering options.
  var filterOptions = await Dropdown.findAll({
    where: {
      dropdownFormID: 29, // filtering options.
      dropdownTitle: "Taxi Filtering Options",
    },
  });

  // if there are no filter parameters.
  if (!req.query.filterCategory || !req.query.filterValue) {
    TaxiBroker.findAndCountAll({
      limit: req.query.limit,
      offset: req.skip,
      include: [
        {
          model: TaxiBrokerAddress,
        },
      ],
    }).then((results) => {
      // for pagination.
      const itemCount = results.count;
      const pageCount = Math.ceil(results.count / req.query.limit);

      return res.render("taxiLicenses/index", {
        title: "BWG | Taxi Licenses",
        errorMessages: messages,
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
    });
  } else {
    // format filterCategory to match column name in db - via handy dandy camelize() function.
    var filterCategory = funcHelpers.camelize(req.query.filterCategory);

    // create filter query.
    TaxiBroker.findAndCountAll({
      where: {
        [filterCategory]: {
          [Op.like]: "%" + req.query.filterValue + "%",
        },
      },
      limit: req.query.limit,
      offset: req.skip,
      include: [
        {
          model: TaxiBrokerAddress,
        },
      ],
    })
      .then((results) => {
        // for pagination.
        const itemCount = results.count;
        const pageCount = Math.ceil(results.count / req.query.limit);

        return res.render("taxiLicenses/index", {
          title: "BWG | Taxi Licenses",
          errorMessages: messages,
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
      .catch((err) =>
        res.render("taxiLicenses/index", {
          title: "BWG | Taxi Licenses",
          message: "Page Error!",
        })
      );
  }
});

/* POST /taxiLicenses - renews license. */
router.post("/", async (req, res, next) => {
  // server side validation.
  const errors = validationResult(req);

  // if errors is NOT empty (if there are errors...).
  if (!errors.isEmpty()) {
    return res.render("taxiLicenses/index", {
      title: "BWG | Taxi Licenses",
      errorMessages: "Page Error!",
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

    // update license.
    TaxiBroker.update(
      {
        issueDate: issueDate,
        expiryDate: expiryDate,
      },
      {
        where: {
          taxiBrokerID: req.body.taxiBrokerID,
        },
      }
    ).then(() => {
      return res.redirect("/taxiLicenses");
    });
  }
});

/* POST /taxiLicenses/history - getting value to search by, then redirect */
router.post(
  "/history",
  body("companyName")
    .if(body("companyName").notEmpty())
    .matches(/^[^%<>^$\/\\;!{}?]+$/)
    .withMessage("Invalid Company Name Entry!")
    .trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...).
    if (!errors.isEmpty()) {
      return res.render("taxiLicenses/index", {
        title: "BWG | Taxi Licenses",
        message: "Page Error!",
        email: req.session.email,
        auth: req.session.auth, // authorization.
      });
    } else {
      // get the specified company.
      TaxiBroker.findOne({
        where: {
          companyName: req.body.companyName,
        },
      })
        .then((results) => {
          // redirect to unique history page.
          return res.redirect(
            "/taxiLicenses/brokerAddressHistory/" + results.taxiBrokerID
          );
        }) // catch any scary errors and render page error.
        .catch((err) =>
          res.render("taxiLicenses/index", {
            title: "BWG | Taxi Licenses",
            message: "Page Error!",
          })
        );
    }
  }
);

module.exports = router;
