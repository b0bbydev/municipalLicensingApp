var express = require("express");
var router = express.Router();
const { redirectToLogin } = require("../../config/authHelpers");
// models.
const Owner = require("../../models/dogtags/owner");
const Address = require("../../models/dogtags/address");
const Dog = require("../../models/dogtags/dog");
const Dropdown = require("../../models/dropdownManager/dropdown");
const AdditionalOwner = require("../../models/dogtags/additionalOwner");
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
        title: "BWG | Dogtags",
        message: "Page Error!",
      });
    } else {
      // check if there's an error message in the session
      let messages = req.session.messages || [];
      // clear session messages
      req.session.messages = [];
      // delete session lastEnteredDropdownTitle.
      delete req.session.lastEnteredDropdownTitle;

      // get dropdown values.
      var dropdownValues = await Dropdown.findAll({
        where: {
          dropdownFormID: 1,
        },
      });

      // if there are no filter parameters.
      if (!req.query.filterCategory || !req.query.filterValue) {
        // get all owners & addresses.
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
            // for pagination.
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
              pages: paginate.getArrayPages(req)(5, pageCount, req.query.page),
              prev: paginate.href(req)(true),
              hasMorePages: paginate.hasNextPages(req)(pageCount),
            });
          })
          // catch any scary errors and render page error.
          .catch((err) =>
            res.render("dogtags", {
              title: "BWG | Dogtags",
              message: "Page Error! ",
            })
          );
        // use a different function (SQL query) if filtering by tagNumber.
      } else if (req.query.filterCategory === "Dog Tag Number") {
        Owner.findAndCountAll({
          where: {
            $tagNumber$: req.query.filterValue,
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
            // for pagination.
            const itemCount = results.count;
            const pageCount = Math.ceil(results.count / req.query.limit);

            return res.render("dogtags", {
              title: "BWG | Dog Tags",
              email: req.session.email,
              data: results.rows,
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
            res.render("dogtags", {
              title: "BWG | Dogtags",
              message: "Page Error! ",
            })
          );
      } else {
        // format filterCategory in URL to match column name in db.
        switch (req.query.filterCategory) {
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

        // create filter query.
        Owner.findAndCountAll({
          where: {
            [filterCategory]: {
              [Op.like]: req.query.filterValue + "%",
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
            // for pagination.
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
              pages: paginate.getArrayPages(req)(5, pageCount, req.query.page),
              prev: paginate.href(req)(true),
              hasMorePages: paginate.hasNextPages(req)(pageCount),
            });
          })
          // catch any scary errors and render page error.
          .catch((err) =>
            res.render("dogtags", {
              title: "BWG | Dogtags",
              message: "Page Error! ",
            })
          );
      }
    }
  }
);

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

      // get ownerName.
      var ownerName = await dbHelpers.getNameFromOwnerID(req.session.ownerID);

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

      // get addressHistory data.
      var addressHistory = await dbHelpers.getAddressHistory(
        req.session.ownerID
      );
      // get dogHistory data.
      var dogHistory = await dbHelpers.getDogHistory(req.session.ownerID);

      AdditionalOwner.findAndCountAll({
        limit: req.query.limit,
        offset: req.skip,
        where: {
          ownerID: req.session.ownerID,
        },
      }).then((additionalOwners) => {
        Dog.findAndCountAll({
          limit: req.query.limit,
          offset: req.skip,
          where: {
            ownerID: req.session.ownerID,
          },
        })
          .then((results) => {
            // for pagination.
            const itemCount = results.count;
            const pageCount = Math.ceil(results.count / req.query.limit);

            // return endpoint after passing validation.
            return res.render("dogtags/owner", {
              title: "BWG | Owner",
              errorMessages: messages,
              email: req.session.email,
              ownerName: ownerName,
              ownerID: req.session.ownerID,
              queryCount: "Dog(s) on record: " + results.count,
              data: results.rows,
              additionalOwners: additionalOwners.rows,
              addressHistory: addressHistory,
              dogHistory: dogHistory,
              pageCount,
              itemCount,
              pages: paginate.getArrayPages(req)(5, pageCount, req.query.page),
              prev: paginate.href(req)(true),
              hasMorePages: paginate.hasNextPages(req)(pageCount),
            });
          })
          // catch any scary errors and render page error.
          .catch((err) =>
            res.render("owner", {
              title: "BWG | Owner",
              message: "Page Error! ",
            })
          );
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
