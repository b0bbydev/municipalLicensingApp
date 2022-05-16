var express = require("express");
var router = express.Router();
const { redirectToLogin } = require("../../config/authHelpers");
// dbHelpers.
var dbHelpers = require("../../config/dbHelpers");
// filterHelpers.
var filterHelpers = require("../../config/filterHelpers");
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

      // get total count of owners.
      var ownersCount = await dbHelpers.countOwners();
      const pageCount = Math.ceil(ownersCount.count / 50);

      // || 0 prevents the validation from triggering on initial page load.
      var data = await dbHelpers.getAllOwners(parseInt(req.query.skip) || 0);

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
  function (req, res, next) {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("dogtags", {
        title: "BWG | Dog Tags",
        message: "Filtering Error!",
        email: req.session.email,
      });
    } else {
      if (
        // ALL supplied filters.
        req.body.filterCategory &&
        req.body.filterValue
      ) {
        filterHelpers.filterCategoryAndValue(
          req.body.filterCategory,
          req.body.filterValue,
          req,
          res
        );
      } else if (
        // NO supplied filters.
        !req.body.filterCategory &&
        !req.body.filterValue
      ) {
        return res.render("dogtags", {
          title: "BWG | Dog Tags",
          message: "Please provide a value to filter by!",
          email: req.session.email,
        });
      }
    }
  }
); // end of post.

module.exports = router;
