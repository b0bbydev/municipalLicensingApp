var express = require("express");
var router = express.Router();
// models.
const StreetClosurePermit = require("../../models/streetClosurePermits/streetClosurePermit");
const Dropdown = require("../../models/dropdownManager/dropdown");
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
  var dropdownValues = await Dropdown.findAll({
    where: {
      dropdownFormID: 20, // street closure permit filter options
    },
  });

  // if there are no filter parameters.
  if (!req.query.filterCategory || !req.query.filterValue) {
    // get street closure permits.
    StreetClosurePermit.findAndCountAll({
      limit: req.query.limit,
      offset: req.skip,
    })
      .then((results) => {
        // for pagination.
        const itemCount = results.count;
        const pageCount = Math.ceil(results.count / req.query.limit);
        return res.render("streetClosurePermit/index", {
          title: "BWG | Street Closure Permits",
          errorMessages: messages,
          email: req.session.email,
          auth: req.session.auth, // authorization.
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
        res.render("streetClosurePermit/index", {
          title: "BWG | Street Closure Permits",
          message: "Page Error!",
        })
      );
  } else {
    // format filterCategory to match column name in db - via handy dandy camelize() function.
    var filterCategory = funcHelpers.camelize(req.query.filterCategory);

    StreetClosurePermit.findAndCountAll({
      where: {
        [filterCategory]: {
          [Op.like]: req.query.filterValue + "%",
        },
      },
      limit: req.query.limit,
      offset: req.skip,
    }).then((results) => {
      // for pagination.
      const itemCount = results.count;
      const pageCount = Math.ceil(results.count / req.query.limit);

      return res.render("streetClosurePermit/index", {
        title: "BWG | Street Closure Permits",
        errorMessages: messages,
        email: req.session.email,
        auth: req.session.auth, // authorization.
        data: results.rows,
        filterCategory: req.query.filterCategory,
        filterValue: req.query.filterValue,
        dropdownValues: dropdownValues,
        pageCount,
        itemCount,
        queryCount: "Records returned: " + results.count,
        pages: paginate.getArrayPages(req)(5, pageCount, req.query.page),
        prev: paginate.href(req)(true),
        hasMorePages: paginate.hasNextPages(req)(pageCount),
      });
    });
  }
});

module.exports = router;
