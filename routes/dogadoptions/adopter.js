var express = require("express");
var router = express.Router();
// models.
const Adopter = require("../../models/dogAdoptions/adopter");
// sequelize.
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
// pagination lib.
const paginate = require("express-paginate");
// express-validate.
const { body, param, validationResult } = require("express-validator");

/* GET /dogAdoptions/adopter */
router.get(
  "/:id",
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
      return res.render("dogAdoptions/adopter", {
        title: "BWG | Dog Adoptions",
        message: "Page Error!",
        auth: req.session.auth, // authorization.
      });
    } else {
      // check if there's an error message in the session
      let messages = req.session.messages || [];
      // clear session messages
      req.session.messages = [];

      // if there are no filter parameters.
      if (!req.query.filterCategory || !req.query.filterValue) {
        // get all owners & addresses.
        Adopter.findAndCountAll({
          limit: req.query.limit,
          offset: req.skip,
          order: [["adopterID", "DESC"]],
        })
          .then((results) => {
            // for pagination.
            const itemCount = results.count;
            const pageCount = Math.ceil(results.count / req.query.limit);

            return res.render("dogAdoptions/adopter", {
              title: "BWG | Dog Adoptions",
              message: messages,
              email: req.session.email,
              auth: req.session.auth, // authorization.
              data: results.rows,
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
            return res.render("dogAdoptions/adopter", {
              title: "BWG | Dog Adoptions",
              message: "Page Error!",
              auth: req.session.auth, // authorization.
            });
          });
      }
    }
  }
);

module.exports = router;
