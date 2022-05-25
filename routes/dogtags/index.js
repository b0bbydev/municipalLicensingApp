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
const { body, param, query, validationResult } = require("express-validator");

/* GET /dogtags */
router.get(
  "/",
  query("skip").if(query("skip").exists()).isNumeric(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
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

/* POST /dogtags */
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
        // else something weird happens..
      } else {
        return res.render("dogtags", {
          title: "BWG | Dog Tags",
          message: "Please ensure both filtering conditions are valid!",
          email: req.session.email,
        });
      }
    }
  }
); // end of post.

/* GET owner page. */
router.get(
  "/owner/:id",
  param("id").matches(/^\d+$/).trim(), // ensure only a number is passed into the params.
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("dogtags", {
        title: "BWG | Owner",
        message: "Error!",
        email: req.session.email,
      });
    } else {
      // check if there's an error message in the session
      let messages = req.session.messages || [];

      // clear session messages
      req.session.messages = [];

      // send ownerID to session; should be safe to do so here after validation.
      req.session.ownerID = req.params.id;

      // dog data.
      var data = await dbHelpers.getOwnerDogs(req.session.ownerID);
      // get ownerName from custom query.
      var ownerName = await dbHelpers.getNameFromOwnerID(req.session.ownerID);

      // get addressHistory data too.
      var addressHistory = await dbHelpers.getAddressHistory(
        req.session.ownerID
      );

      // error handle here, if supplied ownerID isn't in database.
      if (ownerName[0]) {
        ownerName = ownerName[0].firstName + " " + ownerName[0].lastName;
      } else {
        return res.render("dogtags/owner", {
          title: "BWG | Owner",
          message: "Owner Lookup Error!",
          email: req.session.email,
        });
      }

      return res.render("dogtags/owner", {
        title: "BWG | Owner",
        errorMessages: messages,
        email: req.session.email,
        ownerName: ownerName,
        ownerID: req.session.ownerID,
        queryCount: "Dog(s) on record: " + data.length,
        data: data,
        addressHistory: addressHistory,
      });
    }
  }
);

/* GET /dogtags/renew/:id page. */
router.get(
  "/renew/:id",
  param("id").isNumeric().trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("dogtags/renew", {
        title: "BWG | Renew",
        message: "Page Error!",
        email: req.session.email,
      });
    } else {
      // check if there's an error message in the session
      let messages = req.session.messages || [];

      // clear session messages
      req.session.messages = [];

      return res.render("dogtags/renew", {
        title: "BWG | Renew",
        errorMessages: messages,
        email: req.session.email,
      });
    }
  }
);

/* POST /dogtags/renew/:id */
router.post(
  "/renew/:id",
  body("issueDate").isDate().trim(),
  body("expiryDate").isDate().trim(),
  param("id").matches(/^\d+$/).trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("dogtags/renew", {
        title: "BWG | Renew",
        message: "Form Error!",
        email: req.session.email,
      });
    } else {
      // update licenses.
      dbHelpers.updateLicenses(
        req.body.issueDate,
        req.body.expiryDate,
        req.params.id
      );

      // redirect back to dogtags.
      res.redirect("/dogtags");
    }
  }
);

module.exports = router;
