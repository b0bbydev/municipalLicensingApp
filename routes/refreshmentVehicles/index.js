var express = require("express");
var router = express.Router();
// models.
const Dropdown = require("../../models/dropdownManager/dropdown");
const RefreshmentVehicle = require("../../models/refreshmentVehicles/refreshmentVehicle");
// sequelize.
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
// pagination lib.
const paginate = require("express-paginate");
// express-validate.
const { body, validationResult } = require("express-validator");

/* GET /refreshmentVehicles */
router.get("/", async (req, res, next) => {
  // check if there's an error message in the session
  let messages = req.session.messages || [];
  // clear session messages
  req.session.messages = [];

  // if there are no filter parameters.
  if (!req.query.filterCategory || !req.query.filterValue) {
    RefreshmentVehicle.findAndCountAll({
      limit: req.query.limit,
      offset: req.skip,
    }).then((results) => {
      // for pagination.
      const itemCount = results.count;
      const pageCount = Math.ceil(results.count / req.query.limit);

      return res.render("refreshmentVehicles/index", {
        title: "BWG | Refreshment Vehicle Licensing",
        errorMessages: messages,
        email: req.session.email,
        auth: req.session.auth, // authorization.
        data: results.rows,
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

/* POST /refreshmentVehicles - renews license. */
router.post("/", async (req, res, next) => {
  // server side validation.
  const errors = validationResult(req);

  // if errors is NOT empty (if there are errors...).
  if (!errors.isEmpty()) {
    return res.render("refreshmentVehicles/index", {
      title: "BWG | Refreshment Vehicle Licensing",
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
    HawkerPeddlerBusiness.update(
      {
        issueDate: issueDate,
        expiryDate: expiryDate,
      },
      {
        where: {
          hawkerPeddlerBusinessID: req.body.hawkerPeddlerBusinessID,
        },
      }
    ).then(() => {
      return res.redirect("/hawkerPeddler");
    });
  }
});

module.exports = router;
