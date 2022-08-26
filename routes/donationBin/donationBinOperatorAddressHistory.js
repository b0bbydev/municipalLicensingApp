var express = require("express");
var router = express.Router();
// models.
const Dropdown = require("../../models/dropdownManager/dropdown");
const DonationBinOperatorAddressHistory = require("../../models/donationBin/donationBinOperatorAddressHistory");
// helpers.
const funcHelpers = require("../../config/funcHelpers");
// sequelize.
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
// express-validate.
const { body, validationResult } = require("express-validator");

/* GET /donationBin/donationBinOperatorAddressHistory/:id */
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
      return res.render("donationBin/donationBinOperatorAddressHistory", {
        title: "BWG | Donation Bin Operator Address History",
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
        DonationBinOperatorAddressHistory.findAndCountAll({
          where: {
            donationBinOperatorID: req.params.id,
          },
          order: [["lastModified", "DESC"]],
        })
          .then((results) => {
            return res.render("donationBin/donationBinOperatorAddressHistory", {
              title: "BWG | Donation Bin Operator Address History",
              message: messages,
              email: req.session.email,
              auth: req.session.auth, // authorization.
              monthDropdownValues: monthDropdownValues,
              yearDropdownValues: yearDropdownValues,
              data: results.rows,
              donationBinOperatorID: req.params.id,
            });
          })
          .catch((err) => {
            return res.render("donationBin/donationBinOperatorAddressHistory", {
              title: "BWG | Donation Bin Operator Address History",
              message: "Page Error!",
              auth: req.session.auth, // authorization.
            });
          });
        // both year and month filter.
      } else if (req.query.filterMonth && req.query.filterYear) {
        DonationBinOperatorAddressHistory.findAndCountAll({
          where: {
            [Op.and]: [
              { donationBinOperatorID: req.params.id },
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
        })
          .then((results) => {
            return res.render("donationBin/donationBinOperatorAddressHistory", {
              title: "BWG | Donation Bin Operator Address History",
              message: messages,
              email: req.session.email,
              auth: req.session.auth, // authorization.
              monthDropdownValues: monthDropdownValues,
              yearDropdownValues: yearDropdownValues,
              data: results.rows,
              donationBinOperatorID: req.params.id,
              filterMonth: req.query.filterMonth,
              filterYear: req.query.filterYear,
            });
          })
          .catch((err) => {
            return res.render("donationBin/donationBinOperatorAddressHistory", {
              title: "BWG | Donation Bin Operator Address History",
              message: "Page Error!",
              auth: req.session.auth, // authorization.
            });
          });
        // if at least one filter exists.
      } else if (req.query.filterMonth || req.query.filterYear) {
        /* IF ONLY YEAR. */
        if (!req.query.filterMonth) {
          DonationBinOperatorAddressHistory.findAndCountAll({
            where: {
              // where donationBinOperatorID = req.params.id AND year(lastModifed) = req.query.filterYear.
              [Op.and]: [
                { donationBinOperatorID: req.params.id },
                Sequelize.where(
                  Sequelize.fn("year", Sequelize.col("lastModified")),
                  [req.query.filterYear]
                ),
              ],
            },
            order: [["lastModified", "DESC"]],
          })
            .then((results) => {
              return res.render(
                "donationBin/donationBinOperatorAddressHistory",
                {
                  title: "BWG | Donation Bin Operator Address History",
                  message: messages,
                  email: req.session.email,
                  auth: req.session.auth, // authorization.
                  monthDropdownValues: monthDropdownValues,
                  yearDropdownValues: yearDropdownValues,
                  data: results.rows,
                  donationBinOperatorID: req.params.id,
                  filterMonth: req.query.filterMonth,
                  filterYear: req.query.filterYear,
                }
              );
            })
            .catch((err) => {
              return res.render(
                "donationBin/donationBinOperatorAddressHistory",
                {
                  title: "BWG | Donation Bin Operator Address History",
                  message: "Page Error!",
                  auth: req.session.auth, // authorization.
                }
              );
            });
          /* IF ONLY MONTH. */
        } else if (!req.query.filterYear) {
          DonationBinOperatorAddressHistory.findAndCountAll({
            where: {
              // where donationBinOperatorID = req.params.id AND year(lastModifed) = req.query.filterYear.
              [Op.and]: [
                { donationBinOperatorID: req.params.id },
                Sequelize.where(
                  Sequelize.fn("month", Sequelize.col("lastModified")),
                  [funcHelpers.monthToNumber(req.query.filterMonth)]
                ),
              ],
            },
            order: [["lastModified", "DESC"]],
          })
            .then((results) => {
              return res.render(
                "donationBin/donationBinOperatorAddressHistory",
                {
                  title: "BWG | Donation Bin Operator Address History",
                  message: messages,
                  email: req.session.email,
                  auth: req.session.auth, // authorization.
                  monthDropdownValues: monthDropdownValues,
                  yearDropdownValues: yearDropdownValues,
                  data: results.rows,
                  donationBinOperatorID: req.params.id,
                  filterMonth: req.query.filterMonth,
                  filterYear: req.query.filterYear,
                }
              );
            })
            .catch((err) => {
              return res.render(
                "donationBin/donationBinOperatorAddressHistory",
                {
                  title: "BWG | Donation Bin Operator Address History",
                  message: "Page Error!",
                  auth: req.session.auth, // authorization.
                }
              );
            });
        }
      }
    }
  }
);

module.exports = router;
