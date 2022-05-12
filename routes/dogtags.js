var express = require("express");
var router = express.Router();
const { redirectToLogin } = require("../config/authHelpers");
// db config.
var db = require("../config/db");
// dbHelpers.
var dbHelpers = require("../config/dbHelpers");
// filterHelpers.
var filterHelpers = require("../config/filterHelpers");
// pagination lib.
const paginate = require("express-paginate");
// express-validate.
const { body, validationResult } = require("express-validator");

/* GET dogtag page. */
router.get("/", async (req, res, next) => {
  // check if there's an error message in the session
  let messages = req.session.messages || [];

  // clear session messages
  req.session.messages = [];

  // create pagination query.
  var pagQuery =
    "SELECT * FROM owners LEFT JOIN dogs ON owners.ownerID = dogs.ownerID LEFT JOIN addresses ON owners.ownerID = addresses.ownerID LEFT JOIN licenses ON owners.ownerID = licenses.ownerID LIMIT 50 OFFSET ?";

  // get total count of records
  var count = await dbHelpers.countOwnersAndDogs();
  const pageCount = Math.ceil(count.count / 50);

  // call query on database, passing in the skip(offset) from req.query.skip.
  db.query(pagQuery, [parseInt(req.query.skip) || 0], function (err, data) {
    if (err) {
      console.log("Error: ", err);
    }

    res.render("dogtags", {
      title: "BWG | Dog Tags",
      errorMessages: messages,
      isAdmin: req.session.isAdmin,
      email: req.session.email,
      data: data,
      queryCount: "Records returned: " + data.length,
      pages: paginate.getArrayPages(req)(pageCount, pageCount, req.query.page),
    });
  });
});

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
      }
      if (
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
