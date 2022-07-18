var express = require("express");
var router = express.Router();
// models.
const Dropdown = require("../../models/dropdownManager/dropdown");
const Procedure = require("../../models/policies/procedure");
const Policy = require("../../models/policies/policy");
// sequelize.
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
// helper.
const funcHelpers = require("../../config/funcHelpers");
// pagination lib.
const paginate = require("express-paginate");
// express-validate.
const { body, validationResult } = require("express-validator");

/* GET /policies/procedures */
router.get("/", async (req, res, next) => {
  // check if there's an error message in the session.
  let messages = req.session.messages || [];
  // clear session messages.
  req.session.messages = [];

  // get dropdown values.
  var dropdownValues = await Dropdown.findAll({
    where: {
      dropdownFormID: 18, // Procedure Filtering Form
    },
  });

  // get all policies.
  var policies = await Policy.findAll();

  // if there are no filter parameters.
  if (!req.query.filterCategory || !req.query.filterValue) {
    Procedure.findAndCountAll({
      limit: req.query.limit,
      offset: req.skip,
      where: {
        policyID: {
          [Op.eq]: null, // where policyID is null.
        },
      },
    }).then((results) => {
      // for pagination.
      const itemCount = results.count;
      const pageCount = Math.ceil(results.count / req.query.limit);

      return res.render("policies/procedures", {
        title: "BWG | Procedures",
        errorMessages: messages,
        email: req.session.email,
        auth: req.session.auth, // authorization.
        data: results.rows,
        policies: policies,
        dropdownValues: dropdownValues,
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
    Procedure.findAndCountAll({
      where: {
        [filterCategory]: {
          [Op.like]: "%" + req.query.filterValue + "%",
        },
        [Op.and]: {
          policyID: {
            [Op.eq]: null, // where policyID is null.
          },
        },
      },
      limit: req.query.limit,
      offset: req.skip,
    })
      .then((results) => {
        // for pagination.
        const itemCount = results.count;
        const pageCount = Math.ceil(results.count / req.query.limit);

        return res.render("policies/procedures", {
          title: "BWG | Procedures",
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
      })
      // catch any scary errors and render page error.
      .catch((err) =>
        res.render("policies/procedures", {
          title: "BWG | Procedures",
          message: "Page Error!",
        })
      );
  }
});

/* POST /policies/procedures */
router.post(
  "/",
  body("policyName")
    .if(body("policyName").notEmpty())
    .matches(/^[a-zA-Z0-9\/\-. ]*$/)
    .withMessage("Invalid Policy Name Entry!")
    .trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...).
    if (!errors.isEmpty()) {
      return res.render("policies/procedures", {
        title: "BWG | Procedures",
        message: "Page Error!",
        email: req.session.email,
        auth: req.session.auth, // authorization.
      });
    } else {
      // get the specified policy based on name.
      Policy.findOne({
        attributes: ["policyID"],
        where: {
          policyName: req.body.policyName,
        },
      })
        .then((results) => {
          policyID = results.policyID;
        })
        .then(() => {
          Procedure.update(
            {
              policyID: policyID,
            },
            {
              where: {
                procedureID: req.body.procedureID,
              },
            }
          );
        })
        .then(() => {
          res.redirect("/policies");
        })
        .catch((err) =>
          res.render("policies/procedures", {
            title: "BWG | Procedures",
            message: "Page Error!",
          })
        );
    }
  }
);

module.exports = router;
