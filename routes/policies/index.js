var express = require("express");
var router = express.Router();
const { redirectToLogin } = require("../../config/authHelpers");
// models.
const Policy = require("../../models/policies/policy");
const Dropdown = require("../../models/dropdownManager/dropdown");
// sequelize.
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
// pagination lib.
const paginate = require("express-paginate");
// express-validate.
const { body, validationResult } = require("express-validator");

/* GET /policies */
router.get("/", async (req, res, next) => {
  // check if there's an error message in the session
  let messages = req.session.messages || [];

  // clear session messages
  req.session.messages = [];

  // get dropdown values.
  var dropdownValues = await Dropdown.findAll({
    where: {
      dropdownFormID: 2, // the specific ID for this dropdown menu. Maybe change to something dynamic? Not sure of the possiblities as of yet.
    },
  });

  // get all the policies.
  Policy.findAndCountAll({ limit: req.query.limit, offset: req.skip }).then(
    (results) => {
      // for pagination.
      const itemCount = results.count;
      const pageCount = Math.ceil(results.count / req.query.limit);

      return res.render("policies", {
        title: "BWG | Policies & Procedures",
        errorMessages: messages,
        email: req.session.email,
        data: results.rows,
        dropdownValues: dropdownValues,
        pageCount,
        itemCount,
        queryCount: "Records returned: " + results.count,
        pages: paginate.getArrayPages(req)(5, pageCount, req.query.page),
        prev: paginate.href(req)(true),
        hasMorePages: paginate.hasNextPages(req)(pageCount),
      });
    }
  );
});

/* POST /policies */
router.post(
  "/",
  // validate all input fields.
  body("filterCategory")
    .matches(/^[^'";=_()*&%$#!<>\/\^\\]*$/)
    .trim(),
  body("filterValue")
    .matches(/^[^'";=_()*&%$#!<>\/\^\\]*$/)
    .trim(),
  function (req, res, next) {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("policies", {
        title: "BWG | Policies",
        message: "Filtering Error!",
        email: req.session.email,
      });
    } else {
      if (
        // ALL supplied filters.
        req.body.filterCategory &&
        req.body.filterValue
      ) {
        // format filterCategory to match column name in db.
        switch (req.body.filterCategory) {
          case "Policy ID":
            filterCategory = "policyID";
            break;
        }

        // create filter query.
        Policy.findAndCountAll({
          where: {
            [filterCategory]: {
              [Op.like]: req.body.filterValue + "%",
            },
          },
          limit: req.query.limit,
          offset: req.skip,
        })
          .then((results) => {
            // for pagination.
            const itemCount = results.count;
            const pageCount = Math.ceil(results.count / req.query.limit);

            return res.render("policies", {
              title: "BWG | Policies",
              email: req.session.email,
              data: results.rows,
              pageCount,
              itemCount,
              queryCount: "Records returned: " + results.count,
              pages: paginate.getArrayPages(req)(5, pageCount, req.query.page),
              prev: paginate.href(req)(true),
              hasMorePages: paginate.hasNextPages(req)(pageCount),
            });
          })
          .catch((err) => next(err));
      } else if (
        // NO supplied filters.
        !req.body.filterCategory &&
        !req.body.filterValue
      ) {
        return res.render("policies", {
          title: "BWG | Policies",
          message: "Please provide a value to filter by!",
          email: req.session.email,
        });
        // else something weird happens..
      } else {
        return res.render("policies", {
          title: "BWG | Policies",
          message: "Please ensure BOTH filtering conditions are valid!",
          email: req.session.email,
        });
      }
    }
  }
); // end of post.

/* GET /policies/policy/:id */
router.get("/policy/:id", async (req, res, next) => {
  // check if there's an error message in the session
  let messages = req.session.messages || [];

  // clear session messages
  req.session.messages = [];

  return res.render("policies/policy", {
    title: "BWG | Policy",
    errorMessages: messages,
    email: req.session.email,
  });
});

module.exports = router;
