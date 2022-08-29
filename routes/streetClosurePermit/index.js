var express = require("express");
var router = express.Router();
// models.
const Dropdown = require("../../models/dropdownManager/dropdown");
const StreetClosurePermit = require("../../models/streetClosurePermits/streetClosurePermit");
const StreetClosureContact = require("../../models/streetClosurePermits/streetClosureContact");
const StreetClosureContactAddress = require("../../models/streetClosurePermits/streetClosureContactAddress");
const StreetClosureCoordinator = require("../../models/streetClosurePermits/streetClosureCoordinator");
const StreetClosureCoordinatorAddress = require("../../models/streetClosurePermits/streetClosureCoordinatorAddress");
// sequelize.
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
// helper.
const funcHelpers = require("../../config/funcHelpers");
// pagination lib.
const paginate = require("express-paginate");

/* GET /streetClosurePermit */
router.get("/", async (req, res, next) => {
  // check if there's an error message in the session
  let messages = req.session.messages || [];
  // clear session messages
  req.session.messages = [];

  // get dropdown values.
  var filterOptions = await Dropdown.findAll({
    where: {
      dropdownFormID: 29, // filtering options.
      dropdownTitle: "Street Closure Permit Filtering Options",
    },
  });

  // if there are no filter parameters.
  if (!req.query.filterCategory || !req.query.filterValue) {
    // get street closure permits.
    StreetClosurePermit.findAndCountAll({
      limit: req.query.limit,
      offset: req.skip,
      include: [
        {
          model: StreetClosureContact,
          include: [StreetClosureContactAddress],
        },
        {
          model: StreetClosureCoordinator,
          include: [StreetClosureCoordinatorAddress],
        },
      ],
    })
      .then((results) => {
        // for pagination.
        const itemCount = results.count;
        const pageCount = Math.ceil(results.count / req.query.limit);
        return res.render("streetClosurePermit/index", {
          title: "BWG | Street Closure Permits",
          message: messages,
          email: req.session.email,
          auth: req.session.auth, // authorization.
          data: results.rows,
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
        return res.render("streetClosurePermit/index", {
          title: "BWG | Street Closure Permits",
          message: "Page Error!",
          auth: req.session.auth, // authorization.
        });
      });
  } else {
    // format filterCategory to match column name in db - via handy dandy camelize() function.
    var filterCategory = funcHelpers.camelize(req.query.filterCategory);

    StreetClosurePermit.findAndCountAll({
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
          model: StreetClosureContact,
          include: [StreetClosureContactAddress],
        },
        {
          model: StreetClosureCoordinator,
          include: [StreetClosureCoordinatorAddress],
        },
      ],
    })
      .then((results) => {
        // for pagination.
        const itemCount = results.count;
        const pageCount = Math.ceil(results.count / req.query.limit);

        return res.render("streetClosurePermit/index", {
          title: "BWG | Street Closure Permits",
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
        return res.render("streetClosurePermit/index", {
          title: "BWG | Street Closure Permits",
          message: "Page Error!",
          auth: req.session.auth, // authorization.
        });
      });
  }
});

module.exports = router;
