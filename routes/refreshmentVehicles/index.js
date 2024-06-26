var express = require("express");
var router = express.Router();
// models.
const Dropdown = require("../../models/dropdownManager/dropdown");
const RefreshmentVehicle = require("../../models/refreshmentVehicles/refreshmentVehicle");
const RefreshmentVehicleOwner = require("../../models/refreshmentVehicles/refreshmentVehicleOwner");
const RefreshmentVehicleOwnerAddress = require("../../models/refreshmentVehicles/refreshmentVehicleOwnerAddress");
const RefreshmentVehicleOperator = require("../../models/refreshmentVehicles/refreshmentVehicleOperator");
const RefreshmentVehiclePropertyOwner = require("../../models/refreshmentVehicles/refreshmentVehiclePropertyOwner");
const RefreshmentVehiclePropertyOwnerAddress = require("../../models/refreshmentVehicles/refreshmentVehiclePropertyOwnerAddress");
// helper.
const funcHelpers = require("../../config/funcHelpers");
// sequelize.
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
// pagination lib.
const paginate = require("express-paginate");
// express-validate.
const { param, validationResult } = require("express-validator");

/* GET /refreshmentVehicles */
router.get("/", async (req, res, next) => {
  // check if there's an error message in the session
  let messages = req.session.messages || [];
  // clear session messages
  req.session.messages = [];

  // get filter options.
  var filterOptions = await Dropdown.findAll({
    where: {
      dropdownFormID: 29, // filtering options.
      dropdownTitle: "Refreshment Vehicle Filtering Options",
    },
  });

  // get current date.
  var issueDate = new Date();
  // init expiryDate.
  var modalExpiryDate = new Date();

  // if issueDate is in November or December.
  if (issueDate.getMonth() === 10 || issueDate.getMonth() === 11) {
    modalExpiryDate = new Date(issueDate.getFullYear() + 2, 3, 30);
  } else {
    modalExpiryDate = new Date(issueDate.getFullYear() + 1, 3, 30); // year, month (april = 3), day
  }

  // if there are no filter parameters.
  if (!req.query.filterCategory || !req.query.filterValue) {
    RefreshmentVehicle.findAndCountAll({
      limit: req.query.limit,
      offset: req.skip,
      order: [["issueDate", "DESC"]],
    })
      .then((results) => {
        // for pagination.
        const itemCount = results.count;
        const pageCount = Math.ceil(results.count / req.query.limit);

        return res.render("refreshmentVehicles/index", {
          title: "BWG | Refreshment Vehicle Licensing",
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
        return res.render("refreshmentVehicles/index", {
          title: "BWG | Refreshment Vehicle Licensing",
          message: "Page Error!",
          auth: req.session.auth, // authorization.
        });
      });
  } else if (req.query.filterCategory === "Vehicle Owner Name") {
    // checks to see if input contains more than 1 word. i.e: "firstName + lastName"
    if (req.query.filterValue.trim().indexOf(" ") != -1) {
      RefreshmentVehicleOwner.findAndCountAll({
        limit: req.query.limit,
        offset: req.skip,
        order: [["issueDate", "DESC"]],
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
            model: RefreshmentVehicleOwnerAddress,
          },
        ],
      })
        .then((results) => {
          // for pagination.
          const itemCount = results.count;
          const pageCount = Math.ceil(results.count / req.query.limit);

          return res.render("refreshmentVehicles/search/vehicleOwnerSearch", {
            title: "BWG | Refreshment Vehicle Licensing",
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
          return res.render("refreshmentVehicles/search/vehicleOwnerSearch", {
            title: "BWG | Refreshment Vehicle Licensing",
            message: "Page Error!",
            auth: req.session.auth, // authorization.
          });
        });
    } else {
      RefreshmentVehicleOwner.findAndCountAll({
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
            model: RefreshmentVehicleOwnerAddress,
          },
        ],
      })
        .then((results) => {
          // for pagination.
          const itemCount = results.count;
          const pageCount = Math.ceil(results.count / req.query.limit);

          return res.render("refreshmentVehicles/search/vehicleOwnerSearch", {
            title: "BWG | Refreshment Vehicle Licensing",
            message: messages,
            email: req.session.email,
            auth: req.session.auth, // authorization.
            data: results.rows,
            filterCategory: req.query.filterCategory,
            filterValue: req.query.filterValue,
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
        // catch any scary errors and render page error.
        .catch((err) => {
          return res.render("refreshmentVehicles/search/vehicleOwnerSearch", {
            title: "BWG | Refreshment Vehicle Licensing",
            message: "Page Error!",
            auth: req.session.auth, // authorization.
          });
        });
    }
  } else {
    // format filterCategory to match column name in db - via handy dandy camelize() function.
    var filterCategory = funcHelpers.camelize(req.query.filterCategory);

    // create filter query.
    RefreshmentVehicle.findAndCountAll({
      subQuery: false, // fixes column not found error when paginating a join.
      limit: req.query.limit,
      offset: req.skip,
      order: [["issueDate", "DESC"]],
      where: {
        [filterCategory]: {
          [Op.like]: "%" + req.query.filterValue + "%",
        },
      },
    })
      .then((results) => {
        // for pagination.
        const itemCount = results.count;
        const pageCount = Math.ceil(results.count / req.query.limit);

        return res.render("refreshmentVehicles/index", {
          title: "BWG | Refreshment Vehicle Licensing",
          message: messages,
          email: req.session.email,
          auth: req.session.auth, // authorization.
          data: results.rows,
          filterCategory: req.query.filterCategory,
          filterValue: req.query.filterValue,
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
      // catch any scary errors and render page error.
      .catch((err) => {
        return res.render("refreshmentVehicles/index", {
          title: "BWG | Refreshment Vehicle Licensing",
          message: "Page Error!",
          auth: req.session.auth, // authorization.
        });
      });
  }
});

/* POST /refreshmentVehicles - renews license. */
router.post("/", async (req, res, next) => {
  // server side validation.
  const errors = validationResult(req);

  // if errors is NOT empty (if there are errors...).
  if (!errors.isEmpty()) {
    return res.render("refreshmentVehicles/index", {
      title: "BWG | Refreshment Vehicle Licensing",
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
      expiryDate = new Date(issueDate.getFullYear() + 2, 3, 30);
    } else {
      expiryDate = new Date(issueDate.getFullYear() + 1, 3, 30); // year, month (april = 3), day
    }

    // update license.
    RefreshmentVehicle.update(
      {
        issueDate: issueDate,
        expiryDate: expiryDate,
        licenseNumber: req.body.licenseNumber,
      },
      {
        where: {
          refreshmentVehicleID: req.body.refreshmentVehicleID,
        },
      }
    )
      .then(() => {
        return res.redirect("/refreshmentVehicles");
      })
      // catch any scary errors and render page error.
      .catch((err) => {
        return res.render("refreshmentVehicles/index", {
          title: "BWG | Refreshment Vehicle Licensing",
          message: "Page Error!",
          auth: req.session.auth, // authorization.
        });
      });
  }
});

/* GET /refreshmentVehicles/printLicense/:id */
router.get(
  "/printLicense/:id",
  param("id").matches(/^\d+$/).trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("refreshmentVehicles/printLicense", {
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
      RefreshmentVehicle.findOne({
        where: {
          refreshmentVehicleID: req.params.id,
        },
        include: [
          {
            model: RefreshmentVehicleOwner,
          },
          {
            model: RefreshmentVehicleOperator,
          },
          {
            model: RefreshmentVehiclePropertyOwner,
            include: [
              {
                model: RefreshmentVehiclePropertyOwnerAddress,
              },
            ],
          },
        ],
      })
        .then((results) => {
          // return endpoint after passing validation.
          return res.render("refreshmentVehicles/printLicense", {
            title: "BWG | Print License",
            layout: "",
            message: messages,
            email: req.session.email,
            auth: req.session.auth, // authorization.
            // data to populate form with.
            data: {
              refreshmentVehicleOperatorName:
                results.refreshmentVehicleOperators[0].firstName +
                " " +
                results.refreshmentVehicleOperators[0].lastName,
              operatingBusinessName: results.operatingBusinessName,
              streetName:
                results.refreshmentVehiclePropertyOwners[0]
                  .refreshmentVehiclePropertyOwnerAddresses[0].streetName,
              streetNumber:
                results.refreshmentVehiclePropertyOwners[0]
                  .refreshmentVehiclePropertyOwnerAddresses[0].streetNumber,
              town: results.refreshmentVehiclePropertyOwners[0]
                .refreshmentVehiclePropertyOwnerAddresses[0].town,
              issueDate: results.issueDate,
              expiryDate: results.expiryDate,
              licenseNumber: results.licenseNumber,
            },
          });
        })
        // catch any scary errors and render page error.
        .catch((err) => {
          return res.render("refreshmentVehicles/printLicense", {
            title: "BWG | Print License",
            message:
              "Page Error! Ensure that vehicle, property owner & operator information is complete.",
            auth: req.session.auth, // authorization.
          });
        });
    }
  }
);

module.exports = router;
