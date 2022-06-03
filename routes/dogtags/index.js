var express = require("express");
var router = express.Router();
const { redirectToLogin } = require("../../config/authHelpers");
// models.
const Owner = require("../../models/dogtags/owner");
const Address = require("../../models/dogtags/address");
const Dog = require("../../models/dogtags/dog");
const Dropdown = require("../../models/dropdownManager/dropdown");
const DropdownForm = require("../../models/dropdownManager/dropdownForm");
// sequelize.
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
// dbHelpers.
var dbHelpers = require("../../config/dbHelpers");
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

      // get dropdown values.
      var dropdownValues = await Dropdown.findAll({
        where: {
          dropdownFormID: 1, // the specfic ID for this dropdown menu. Maybe change to something dynamic? Not sure of the possiblities as of yet.
        },
      });

      // get owners.
      Owner.findAndCountAll({
        limit: req.query.limit,
        offset: req.skip,
        include: [
          {
            model: Address,
          },
        ],
      })
        .then((results) => {
          const itemCount = results.count;
          const pageCount = Math.ceil(results.count / req.query.limit);

          return res.render("dogtags", {
            title: "BWG | Dog Tags",
            errorMessages: messages,
            email: req.session.email,
            data: results.rows,
            dropdownValues: dropdownValues,
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
  async (req, res, next) => {
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
          Owner.findAndCountAll({
            where: {
              $tagNumber$: req.body.filterValue,
            },
            include: [
              {
                model: Dog,
              },
              {
                model: Address,
              },
            ],
          })
            .then((results) => {
              const itemCount = results.count;
              const pageCount = Math.ceil(results.count / req.query.limit);

              return res.render("dogtags", {
                title: "BWG | Dog Tags",
                email: req.session.email,
                data: results.rows,
                pageCount,
                itemCount,
                queryCount: "Records returned: " + results.count,
                pages: paginate.getArrayPages(req)(
                  3,
                  pageCount,
                  req.query.page
                ),
              });
            })
            .catch((err) => next(err));
        } else {
          // format filterCategory to match column name in db.
          switch (req.body.filterCategory) {
            case "First Name":
              filterCategory = "firstName";
              break;
            case "Last Name":
              filterCategory = "lastName";
              break;
            case "Email":
              filterCategory = "email";
              break;
          }

          // make query.
          Owner.findAndCountAll({
            where: {
              [filterCategory]: {
                [Op.like]: req.body.filterValue + "%",
              },
            },
            limit: req.query.limit,
            offset: req.skip,
            include: [
              {
                model: Address,
              },
            ],
          })
            .then((results) => {
              const itemCount = results.count;
              const pageCount = Math.ceil(results.count / req.query.limit);

              return res.render("dogtags", {
                title: "BWG | Dog Tags",
                email: req.session.email,
                data: results.rows,
                pageCount,
                itemCount,
                queryCount: "Records returned: " + results.count,
                pages: paginate.getArrayPages(req)(
                  3,
                  pageCount,
                  req.query.page
                ),
              });
            })
            .catch((err) => next(err));
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
      var data = await Dog.findAll({
        where: {
          ownerID: req.session.ownerID,
        },
      });
      // get ownerName.
      var ownerName = await dbHelpers.getNameFromOwnerID(req.session.ownerID);
      // get addressHistory data.
      var addressHistory = await dbHelpers.getAddressHistory(
        req.session.ownerID
      );
      // get dogHistory data.
      var dogHistory = await dbHelpers.getDogHistory(req.session.ownerID);

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
        dogHistory: dogHistory,
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
      // get current date for automatic population of license.
      var issueDate = new Date();
      var expiryDate = new Date(issueDate.getFullYear() + 1, 0, 31); // year, month (jan = 0), day

      // no errors, update license.
      Dog.update(
        {
          issueDate: issueDate,
          expiryDate: expiryDate,
        },
        {
          where: {
            dogID: req.params.id,
          },
        }
      ).then((result) => {
        // redirect back to owner profile.
        res.redirect("/dogtags/owner/" + req.session.ownerID);
      });
    }
  }
);

module.exports = router;
