var express = require("express");
var router = express.Router();
const { redirectToLogin } = require("../config/authHelpers");
// dbHelpers.
var dbHelpers = require("../config/dbHelpers");
// filterHelpers.
var filterHelpers = require("../config/filterHelpers");
// pagination lib.
const paginate = require("express-paginate");
// express-validate.
const { body, query, validationResult } = require("express-validator");

/* GET dogtag page. */
router.get(
  "/",
  query("skip").if(query("skip").exists()).isNumeric(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      // render dropdown page with error message.
      return res.render("dogtags", {
        title: "BWG | Dogtags",
        message: "Page Error!",
      });
    } else {
      // check if there's an error message in the session
      let messages = req.session.messages || [];

      // clear session messages
      req.session.messages = [];

      // get total count of records
      var count = await dbHelpers.countDogLicenseTables();
      const pageCount = Math.ceil(count.count / 50);

      // || 0 prevents the validation from triggering on initial page load.
      var data = await dbHelpers.getAllOwners();

      return res.render("dogtags", {
        title: "BWG | Dog Tags",
        errorMessages: messages,
        email: req.session.email,
        data: data,
        queryCount: "Records returned: " + data.length,
        pages: paginate.getArrayPages(req)(
          pageCount,
          pageCount,
          req.query.page
        ),
      });
    }
  }
);

/* POST dogtag page */
router.post(
  "/",
  // validate all input fields.
  body("filterCategory")
    .matches(/^[^'";=_()*&%$#!<>\/\^\\]*$/)
    .trim(),
  body("filterValue")
    .matches(/^[^'";=_()*&%$#!<>\/\^\\]*$/)
    .trim(),
  body("issueYear")
    .matches(/^[^'";=_()*&%$#!<>\/\^\\]*$/)
    .trim(),
  body("issueMonth")
    .matches(/^[^'";=_()*&%$#!<>\/\^\\]*$/)
    .trim(),
  function (req, res, next) {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("dogtags", {
        title: "BWG | Dog Tags",
        message: "Filtering Error!",
        isAdmin: req.session.isAdmin,
        email: req.session.email,
      });
    } else {
      if (
        // ALL supplied filters.
        req.body.filterCategory &&
        req.body.filterValue &&
        req.body.issueYear &&
        req.body.issueMonth
      ) {
        filterHelpers.filterCategoryAndValueAndYearAndMonth(
          req.body.filterCategory,
          req.body.filterValue,
          req.body.issueYear,
          req.body.issueMonth,
          req,
          res
        );
      } else if (
        // NO supplied filters.
        !req.body.filterCategory &&
        !req.body.filterValue &&
        !req.body.issueYear &&
        !req.body.issueMonth
      ) {
        return res.render("dogtags", {
          title: "BWG | Dog Tags",
          message: "Please provide values to filter by!",
          isAdmin: req.session.isAdmin,
          email: req.session.email,
        });
      } else if (
        // ONLY month filter.
        !req.body.filterCategory &&
        !req.body.filterValue &&
        !req.body.issueYear &&
        req.body.issueMonth
      ) {
        filterHelpers.filterMonth(req.body.issueMonth, req, res);
      } else if (
        // ONLY year filter.
        !req.body.filterCategory &&
        !req.body.filterValue &&
        req.body.issueYear &&
        !req.body.issueMonth
      ) {
        filterHelpers.filterYear(req.body.issueYear, req, res);
      } else if (
        // ONLY year & month filter.
        !req.body.filterCategory &&
        !req.body.filterValue &&
        req.body.issueYear &&
        req.body.issueMonth
      ) {
        filterHelpers.filterYearAndMonth(
          req.body.issueYear,
          req.body.issueMonth,
          req,
          res
        );
      } else if (
        // filterCategory, filterValue.
        req.body.filterCategory &&
        req.body.filterValue &&
        !req.body.issueYear &&
        !req.body.issueMonth
      ) {
        filterHelpers.filterCategoryAndValue(
          req.body.filterCategory,
          req.body.filterValue,
          req,
          res
        );
      } else if (
        // filterCategory, filterValue, issueYear
        req.body.filterCategory &&
        req.body.filterValue &&
        req.body.issueYear &&
        !req.body.issueMonth
      ) {
        filterHelpers.filterCategoryAndValueAndYear(
          req.body.filterCategory,
          req.body.filterValue,
          req.body.issueYear,
          req,
          res
        );
      } else if (
        // filterCategory, filterValue, issueMonth
        req.body.filterCategory &&
        req.body.filterValue &&
        !req.body.issueYear &&
        req.body.issueMonth
      ) {
        filterHelpers.filterCategoryAndValueAndMonth(
          req.body.filterCategory,
          req.body.filterValue,
          req.body.issueMonth,
          req,
          res
        );
        // invalid filtering cases
      } else if (!req.body.filterCategory && req.body.filterValue) {
        return res.render("dogtags", {
          title: "BWG | Dog Tags",
          message: "Invalid filtering!",
          isAdmin: req.session.isAdmin,
          email: req.session.email,
        });
      } else if (
        req.body.filterCategory &&
        !req.body.filterValue &&
        !req.body.issueYear &&
        !req.body.issueMonth
      ) {
        return res.render("dogtags", {
          title: "BWG | Dog Tags",
          message: "Invalid filtering!",
          isAdmin: req.session.isAdmin,
          email: req.session.email,
        });
      }
    }
  }
); // end of post.

module.exports = router;
