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
const { body, param, validationResult } = require("express-validator");

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

  // get current date.
  var issueDate = new Date();
  // init expiryDate.
  var modalExpiryDate = new Date();

  // if issueDate is in November or December.
  if (issueDate.getMonth() === 10 || issueDate.getMonth() === 11) {
    modalExpiryDate = new Date(issueDate.getFullYear() + 2, 2, 31);
  } else {
    modalExpiryDate = new Date(issueDate.getFullYear() + 1, 2, 31); // year, month (march = 2), day
  }

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
        return res.render("taxiLicenses/index", {
          title: "BWG | Taxi Licenses",
          message: "Page Error!",
          auth: req.session.auth, // authorization.
        });
      });
  }
});

/* POST /taxiLicenses - renews broker license. */
router.post("/", async (req, res, next) => {
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
    // get current date for automatic population of license.
    var issueDate = new Date();
    // init expiryDate.
    var expiryDate = new Date();

    // if issueDate is in November or December.
    if (issueDate.getMonth() === 10 || issueDate.getMonth() === 11) {
      expiryDate = new Date(issueDate.getFullYear() + 2, 2, 31);
    } else {
      expiryDate = new Date(issueDate.getFullYear() + 1, 2, 31); // year, month (march = 2), day
    }

    // update license.
    TaxiBroker.update(
      {
        issueDate: issueDate,
        expiryDate: expiryDate,
        licenseNumber: req.body.licenseNumber,
      },
      {
        where: {
          taxiBrokerID: req.body.taxiBrokerID,
        },
      }
    )
      .then(() => {
        return res.redirect("/taxiLicenses");
      })
      // catch any scary errors and render page error.
      .catch((err) => {
        return res.render("taxiLicenses/index", {
          title: "BWG | Taxi Licenses",
          message: "Page Error!",
          auth: req.session.auth, // authorization.
        });
      });
  }
});

/* GET /taxiLicenses/printLicense/:id */
router.get(
  "/printLicense/:id",
  param("id").matches(/^\d+$/).trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("taxiLicenses/printLicense", {
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
      TaxiBroker.findOne({
        where: {
          taxiBrokerID: req.params.id,
        },
        include: [
          {
            model: TaxiBrokerAddress,
          },
        ],
      })
        .then((results) => {
          // return endpoint after passing validation.
          return res.render("taxiLicenses/printLicense", {
            title: "BWG | Print License",
            layout: "",
            message: messages,
            email: req.session.email,
            auth: req.session.auth, // authorization.
            // data to populate form with.
            data: {
              ownerName: results.ownerName,
              companyName: results.companyName,
              streetNumber: results.taxiBrokerAddresses[0].streetNumber,
              streetName: results.taxiBrokerAddresses[0].streetName,
              town: results.taxiBrokerAddresses[0].town,
              issueDate: results.issueDate,
              expiryDate: results.expiryDate,
              licenseNumber: results.licenseNumber,
            },
          });
        })
        // catch any scary errors and render page error.
        .catch((err) => {
          return res.render("taxiLicenses/printLicense", {
            title: "BWG | Print License",
            message: "Page Error!",
            auth: req.session.auth, // authorization.
          });
        });
    }
  }
);

module.exports = router;
