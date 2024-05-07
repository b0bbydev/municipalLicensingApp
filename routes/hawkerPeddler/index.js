var express = require("express");
var router = express.Router();
// models.
const Dropdown = require("../../models/dropdownManager/dropdown");
const HawkerPeddlerBusiness = require("../../models/hawkerPeddler/hawkerPeddlerBusiness");
const HawkerPeddlerBusinessAddress = require("../../models/hawkerPeddler/hawkerPeddlerBusinessAddress");
const HawkerPeddlerOperator = require("../../models/hawkerPeddler/hawkerPeddlerOperator");
const HawkerPeddlerOperatorAddress = require("../../models/hawkerPeddler/hawkerPeddleOperatorAddress");
// sequelize.
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
// helper.
const funcHelpers = require("../../config/funcHelpers");
// pagination lib.
const paginate = require("express-paginate");
// express-validate.
const { body, param, validationResult } = require("express-validator");

/* GET /hawkerPeddler */
router.get("/", async (req, res, next) => {
  // check if there's an error message in the session
  let messages = req.session.messages || [];
  // clear session messages
  req.session.messages = [];

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

  // get filtering options.
  var filterOptions = await Dropdown.findAll({
    where: {
      dropdownFormID: 29, // filtering options.
      dropdownTitle: "Hawker & Peddler Filtering Options",
    },
  });

  // if there are no filter parameters.
  if (!req.query.filterCategory || !req.query.filterValue) {
    HawkerPeddlerBusiness.findAndCountAll({
      limit: req.query.limit,
      offset: req.skip,
      order: [["issueDate", "DESC"]],
      include: [
        {
          model: HawkerPeddlerBusinessAddress,
        },
        {
          model: HawkerPeddlerOperator,
        },
      ],
    })
      .then((results) => {
        // for pagination.
        const itemCount = results.count;
        const pageCount = Math.ceil(results.count / req.query.limit);

        return res.render("hawkerPeddler/index", {
          title: "BWG | Hawker & Peddler Licensing",
          message: messages,
          email: req.session.email,
          auth: req.session.auth, // authorization.
          data: results.rows,
          filterOptions: filterOptions,
          modalExpiryDate: modalExpiryDate,
          currentPage: req.query.page,
          pageCount,
          itemCount,
          queryCount: "Records returned: " + results.count,
          pages: paginate.getArrayPages(req)(5, pageCount, req.query.page),
          prev: paginate.href(req)(true),
          hasMorePages: paginate.hasNextPages(req)(pageCount),
        });
      })
      .catch((err) => {
        return res.render("hawkerPeddler/index", {
          title: "BWG | Hawker & Peddler Licensing",
          message: "Page Error!",
          auth: req.session.auth, // authorization.
        });
      });
  } else if (req.query.filterCategory === "Business Name") {
    HawkerPeddlerBusiness.findAndCountAll({
      subQuery: false, // fixes column not found error when paginating a join.
      limit: req.query.limit,
      offset: req.skip,
      where: {
        businessName: {
          [Op.like]: "%" + req.query.filterValue + "%",
        },
      },
      include: [
        {
          model: HawkerPeddlerBusinessAddress,
        },
      ],
    })
      .then((results) => {
        // for pagination.
        const itemCount = results.count;
        const pageCount = Math.ceil(results.count / req.query.limit);

        return res.render("hawkerPeddler/index", {
          title: "BWG | Hawker & Peddler Licensing",
          message: messages,
          email: req.session.email,
          auth: req.session.auth, // authorization.
          data: results.rows,
          filterCategory: req.query.filterCategory,
          filterValue: req.query.filterValue,
          filterOptions: filterOptions,
          currentPage: req.query.page,
          pageCount,
          itemCount,
          queryCount: "Records returned: " + results.count,
          pages: paginate.getArrayPages(req)(5, pageCount, req.query.page),
          prev: paginate.href(req)(true),
          hasMorePages: paginate.hasNextPages(req)(pageCount),
        });
      })
      .catch((err) => {
        return res.render("hawkerPeddler/index", {
          title: "BWG | Hawker & Peddler Licensing",
          message: "Page Error!",
          auth: req.session.auth, // authorization.
        });
      });
  } else if (req.query.filterCategory === "Operator Name") {
    // checks to see if input contains more than 1 word. i.e: "firstName + lastName"
    if (req.query.filterValue.trim().indexOf(" ") != -1) {
      HawkerPeddlerOperator.findAndCountAll({
        limit: req.query.limit,
        offset: req.skip,
        subQuery: false, // adding this gets rid of the 'unknown column' error caused when adding limit & offset.
        where: Sequelize.where(
          Sequelize.fn(
            "concat",
            Sequelize.col("firstName"),
            " ", // have to include the whitespace between. i.e: JohnDoe != John Doe.
            Sequelize.col("lastName")
          ),
          {
            [Op.like]: "%" + req.query.filterValue + "%",
          }
        ),
        include: [
          {
            model: HawkerPeddlerOperatorAddress,
          },
        ],
      })
        .then((results) => {
          // for pagination.
          const itemCount = results.count;
          const pageCount = Math.ceil(results.count / req.query.limit);

          return res.render("hawkerPeddler/search/operatorSearch", {
            title: "BWG | Hawker & Peddler Licensing",
            message: messages,
            email: req.session.email,
            auth: req.session.auth, // authorization.
            data: results.rows,
            filterCategory: req.query.filterCategory,
            filterValue: req.query.filterValue,
            filterOptions: filterOptions,
            currentPage: req.query.page,
            pageCount,
            itemCount,
            queryCount: "Records returned: " + results.count,
            pages: paginate.getArrayPages(req)(5, pageCount, req.query.page),
            prev: paginate.href(req)(true),
            hasMorePages: paginate.hasNextPages(req)(pageCount),
          });
        })
        .catch((err) => {
          return res.render("hawkerPeddler/search/operatorSearch", {
            title: "BWG | Hawker & Peddler Licensing",
            message: "Page Error!",
            auth: req.session.auth, // authorization.
          });
        });
    } else {
      HawkerPeddlerOperator.findAndCountAll({
        limit: req.query.limit,
        offset: req.skip,
        subQuery: false, // adding this gets rid of the 'unknown column' error caused when adding limit & offset.
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
        include: [
          {
            model: HawkerPeddlerOperatorAddress,
          },
        ],
      })
        .then((results) => {
          // for pagination.
          const itemCount = results.count;
          const pageCount = Math.ceil(results.count / req.query.limit);

          return res.render("hawkerPeddler/search/operatorSearch", {
            title: "BWG | Hawker & Peddler Licensing",
            message: messages,
            email: req.session.email,
            auth: req.session.auth, // authorization.
            data: results.rows,
            filterCategory: req.query.filterCategory,
            filterValue: req.query.filterValue,
            filterOptions: filterOptions,
            currentPage: req.query.page,
            pageCount,
            itemCount,
            queryCount: "Records returned: " + results.count,
            pages: paginate.getArrayPages(req)(5, pageCount, req.query.page),
            prev: paginate.href(req)(true),
            hasMorePages: paginate.hasNextPages(req)(pageCount),
          });
        })
        .catch((err) => {
          return res.render("hawkerPeddler/search/operatorSearch", {
            title: "BWG | Hawker & Peddler Licensing",
            message: "Page Error!",
            auth: req.session.auth, // authorization.
          });
        });
    }
  } else if (req.query.filterCategory === "Operator Address") {
    HawkerPeddlerOperator.findAndCountAll({
      limit: req.query.limit,
      offset: req.skip,
      subQuery: false, // adding this gets rid of the 'unknown column' error caused when adding limit & offset.
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
          model: HawkerPeddlerOperatorAddress,
        },
      ],
    })
      .then((results) => {
        // for pagination.
        const itemCount = results.count;
        const pageCount = Math.ceil(results.count / req.query.limit);

        return res.render("hawkerPeddler/search/operatorSearch", {
          title: "BWG | Hawker & Peddler Licensing",
          message: messages,
          email: req.session.email,
          auth: req.session.auth, // authorization.
          data: results.rows,
          filterCategory: req.query.filterCategory,
          filterValue: req.query.filterValue,
          filterOptions: filterOptions,
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
        return res.render("hawkerPeddler/search/operatorSearch", {
          title: "BWG | Hawker & Peddler Licensing",
          message: "Page Error!",
          auth: req.session.auth, // authorization.
        });
      });
  } else {
    // format filterCategory to match column name in db - via handy dandy camelize() function.
    var filterCategory = funcHelpers.camelize(req.query.filterCategory);

    // create filter query.
    HawkerPeddlerBusiness.findAndCountAll({
      subQuery: false, // fixes column not found error when paginating a join.
      limit: req.query.limit,
      offset: req.skip,
      where: {
        [filterCategory]: {
          [Op.like]: req.query.filterValue + "%",
        },
      },
      include: [
        {
          model: HawkerPeddlerBusinessAddress,
        },
      ],
    })
      .then((results) => {
        // for pagination.
        const itemCount = results.count;
        const pageCount = Math.ceil(results.count / req.query.limit);

        return res.render("hawkerPeddler/index", {
          title: "BWG | Hawker & Peddler Licensing",
          message: messages,
          email: req.session.email,
          auth: req.session.auth, // authorization.
          data: results.rows,
          filterCategory: req.query.filterCategory,
          filterValue: req.query.filterValue,
          filterOptions: filterOptions,
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
        return res.render("hawkerPeddler/index", {
          title: "BWG | Hawker & Peddler Licensing",
          message: "Page Error!",
          auth: req.session.auth, // authorization.
        });
      });
  }
});

/* GET /hawkerPeddler/printLicense/:id */
router.get(
  "/printLicense/:id",
  param("id").matches(/^\d+$/).trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("hawkerPeddler/printLicense", {
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
      HawkerPeddlerBusiness.findOne({
        where: {
          hawkerPeddlerBusinessID: req.params.id,
        },
        include: [
          {
            model: HawkerPeddlerBusinessAddress,
          },
          {
            model: HawkerPeddlerOperator,
          },
        ],
      })
        .then((results) => {
          // return endpoint after passing validation.
          return res.render("hawkerPeddler/printLicense", {
            title: "BWG | Print License",
            layout: "",
            message: messages,
            email: req.session.email,
            auth: req.session.auth, // authorization.
            // data to populate form with.
            data: {
              // if the array doesn't exist or is empty, set operatorName to an empty string.
              operatorName:
                results.HawkerPeddlerOperators &&
                results.HawkerPeddlerOperators.length > 0
                  ? results.HawkerPeddlerOperators[0].firstName +
                    " " +
                    results.HawkerPeddlerOperators[0].lastName
                  : "",
              businessName: results.businessName,
              streetNumber:
                results.hawkerPeddlerBusinessAddresses[0].streetNumber,
              streetName: results.hawkerPeddlerBusinessAddresses[0].streetName,
              town: results.hawkerPeddlerBusinessAddresses[0].town,
              issueDate: results.issueDate,
              expiryDate: results.expiryDate,
              licenseNumber: results.licenseNumber,
            },
          });
        })
        // catch any scary errors and render page error.
        .catch((err) => {
          return res.render("hawkerPeddler/printLicense", {
            title: "BWG | Print License",
            message: "Page Error!" + err,
            auth: req.session.auth, // authorization.
          });
        });
    }
  }
);

/* POST /hawkerPeddler - renews license. */
router.post("/", async (req, res, next) => {
  // server side validation.
  const errors = validationResult(req);

  // if errors is NOT empty (if there are errors...).
  if (!errors.isEmpty()) {
    return res.render("hawkerPeddler/business", {
      title: "BWG | Hawker & Peddler Licensing",
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

    // update license.
    HawkerPeddlerBusiness.update(
      {
        issueDate: issueDate,
        expiryDate: expiryDate,
        licenseNumber: req.body.licenseNumber,
      },
      {
        where: {
          hawkerPeddlerBusinessID: req.body.hawkerPeddlerBusinessID,
        },
      }
    )
      .then(() => {
        return res.redirect("/hawkerPeddler");
      })
      // catch any scary errors and render page error.
      .catch((err) => {
        return res.render("hawkerPeddler", {
          title: "BWG | Hawker & Peddler Licensing",
          message: "Page Error!",
          auth: req.session.auth, // authorization.
        });
      });
  }
});

module.exports = router;
