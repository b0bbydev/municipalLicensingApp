var express = require("express");
var router = express.Router();
// models.
const Dropdown = require("../../models/dropdownManager/dropdown");
const HawkerPeddlerPropertyOwnerAddressHistory = require("../../models/hawkerPeddler/hawkerPeddlerPropertyOwnerAddressHistory");
// helpers.
const funcHelpers = require("../../config/funcHelpers");
// sequelize.
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
// express-validate.
const { body, validationResult } = require("express-validator");

/* GET /hawkerPeddler/propertyOwnerAddressHistory/:id */
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

    // get month dropdown values.
    var monthDropdownValues = await Dropdown.findAll({
      where: {
        dropdownFormID: 29, // filtering options.
        dropdownTitle: "Policy History Filtering Options - Months",
      },
    });
    // get year dropdown values.
    var yearDropdownValues = await Dropdown.findAll({
      where: {
        dropdownFormID: 29, // filtering options.
        dropdownTitle: "Policy History Filtering Options - Years",
      },
    });

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("hawkerPeddler/propertyOwnerAddressHistory", {
        title: "BWG | Property Owner Address History",
        message: "Page Error!",
        auth: req.session.auth, // authorization.
      });
    } else {
      // check if there's an error message in the session
      let messages = req.session.messages || [];
      // clear session messages
      req.session.messages = [];

      // if there are no filter parameters.
      if (!req.query.filterMonth && !req.query.filterYear) {
        HawkerPeddlerPropertyOwnerAddressHistory.findAndCountAll({
          where: {
            hawkerPeddlerPropertyOwnerID: req.params.id,
          },
          order: [["lastModified", "DESC"]],
        }).then((results) => {
          return res.render("hawkerPeddler/propertyOwnerAddressHistory", {
            title: "BWG | Property Owner Address History",
            errorMessages: messages,
            email: req.session.email,
            auth: req.session.auth, // authorization.
            monthDropdownValues: monthDropdownValues,
            yearDropdownValues: yearDropdownValues,
            data: results.rows,
            hawkerPeddlerPropertyOwnerID: req.params.id,
          });
        });
        // both year and month filter.
      } else if (req.query.filterMonth && req.query.filterYear) {
        HawkerPeddlerPropertyOwnerAddressHistory.findAndCountAll({
          where: {
            [Op.and]: [
              { hawkerPeddlerPropertyOwnerID: req.params.id },
              Sequelize.where(
                Sequelize.fn("year", Sequelize.col("lastModified")),
                [req.query.filterYear]
              ),
              Sequelize.where(
                Sequelize.fn("month", Sequelize.col("lastModified")),
                [funcHelpers.monthToNumber(req.query.filterMonth)]
              ),
            ],
          },
          order: [["lastModified", "DESC"]],
        }).then((results) => {
          return res.render("hawkerPeddler/propertyOwnerAddressHistory", {
            title: "BWG | Property Owner Address History",
            errorMessages: messages,
            email: req.session.email,
            auth: req.session.auth, // authorization.
            monthDropdownValues: monthDropdownValues,
            yearDropdownValues: yearDropdownValues,
            data: results.rows,
            hawkerPeddlerPropertyOwnerID: req.params.id,
            filterMonth: req.query.filterMonth,
            filterYear: req.query.filterYear,
          });
        });
        // if at least one filter exists.
      } else if (req.query.filterMonth || req.query.filterYear) {
        /* IF ONLY YEAR. */
        if (!req.query.filterMonth) {
          HawkerPeddlerPropertyOwnerAddressHistory.findAndCountAll({
            where: {
              // where hawkerPeddlerPropertyOwnerID = req.params.id AND year(lastModifed) = req.query.filterYear.
              [Op.and]: [
                { hawkerPeddlerPropertyOwnerID: req.params.id },
                Sequelize.where(
                  Sequelize.fn("year", Sequelize.col("lastModified")),
                  [req.query.filterYear]
                ),
              ],
            },
            order: [["lastModified", "DESC"]],
          }).then((results) => {
            return res.render("hawkerPeddler/propertyOwnerAddressHistory", {
              title: "BWG | Property Owner Address History",
              errorMessages: messages,
              email: req.session.email,
              auth: req.session.auth, // authorization.
              monthDropdownValues: monthDropdownValues,
              yearDropdownValues: yearDropdownValues,
              data: results.rows,
              hawkerPeddlerPropertyOwnerID: req.params.id,
              filterMonth: req.query.filterMonth,
              filterYear: req.query.filterYear,
            });
          });
          /* IF ONLY MONTH. */
        } else if (!req.query.filterYear) {
          HawkerPeddlerPropertyOwnerAddressHistory.findAndCountAll({
            where: {
              // where hawkerPeddlerPropertyOwnerID = req.params.id AND year(lastModifed) = req.query.filterYear.
              [Op.and]: [
                { hawkerPeddlerPropertyOwnerID: req.params.id },
                Sequelize.where(
                  Sequelize.fn("month", Sequelize.col("lastModified")),
                  [funcHelpers.monthToNumber(req.query.filterMonth)]
                ),
              ],
            },
            order: [["lastModified", "DESC"]],
          }).then((results) => {
            return res.render("hawkerPeddler/propertyOwnerAddressHistory", {
              title: "BWG | Property Owner Address History",
              errorMessages: messages,
              email: req.session.email,
              auth: req.session.auth, // authorization.
              monthDropdownValues: monthDropdownValues,
              yearDropdownValues: yearDropdownValues,
              data: results.rows,
              hawkerPeddlerPropertyOwnerID: req.params.id,
              filterMonth: req.query.filterMonth,
              filterYear: req.query.filterYear,
            });
          });
        }
      }
    }
  }
);

module.exports = router;
