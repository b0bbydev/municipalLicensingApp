var express = require("express");
var router = express.Router();
const { redirectToLogin } = require("../../config/authHelpers");
// models.
const Owner = require("../../models/owner");
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

      Owner.findAndCountAll({
        limit: req.query.limit,
        offset: req.skip,
      })
        .then((results) => {
          const itemCount = results.count;
          const pageCount = Math.ceil(results.count / req.query.limit);

          return res.render("dogtags", {
            title: "BWG | Dog Tags",
            errorMessages: messages,
            email: req.session.email,
            data: results.rows,
            pageCount,
            itemCount,
            queryCount: "Records returned: " + results.count,
            pages: paginate.getArrayPages(req)(3, pageCount, req.query.page),
          });
        })
        .catch((err) => next(err));
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
        // use a different function (SQL query) if filtering by tagNumber.
        if (req.body.filterCategory === "Dog Tag Number") {
          filterHelpers.filterTagNumber(req.body.filterValue, req, res);
        } else {
          filterHelpers.filterCategoryAndValue(
            req.body.filterCategory,
            req.body.filterValue,
            req,
            res
          );
        }
      } else if (
        // NO supplied filters, render error message.
        !req.body.filterCategory &&
        !req.body.filterValue
      ) {
        return res.render("dogtags", {
          title: "BWG | Dog Tags",
          message: "Please ensure BOTH filtering conditions are valid!",
          email: req.session.email,
        });
        // else something weird happens.. (most likely both)
      } else {
        return res.render("dogtags", {
          title: "BWG | Dog Tags",
          message: "Filtering Error!",
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
      // get ownerName.
      var ownerName = await dbHelpers.getNameFromOwnerID(req.session.ownerID);
      // get addressHistory data.
      var addressHistory = await dbHelpers.getAddressHistory(
        req.session.ownerID
      );

      // error handle here as user can pass an invalid one in URL bar.
      // if ownerName exists, concatenate names together.
      if (ownerName[0]) {
        ownerName = ownerName[0].firstName + " " + ownerName[0].lastName;
      } else {
        return res.render("dogtags/owner", {
          title: "BWG | Owner",
          message: "Owner Lookup Error!",
          email: req.session.email,
        });
      }

      // return endpoint after passing validation.
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
  body("issueDate").isDate().withMessage("Invalid Issue Date Entry!").trim(),
  body("expiryDate").isDate().withMessage("Invalid Expiry Date Entry!").trim(),
  param("id").matches(/^\d+$/).trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // use built-in array() to convert Result object to array for custom error messages.
    var errorArray = errors.array();

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("dogtags/renew", {
        title: "BWG | Renew",
        message: errorArray[0].msg,
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
