var express = require("express");
var router = express.Router();
// authHelper middleware.
const {
  isLoggedIn,
  dogLicenseAuth,
  adminAuth,
} = require("../../config/authHelpers");
// models.
const Owner = require("../../models/dogtags/owner");
const Address = require("../../models/dogtags/address");
const Dog = require("../../models/dogtags/dog");
const Dropdown = require("../../models/dropdownManager/dropdown");
const AdditionalOwner = require("../../models/dogtags/additionalOwner");
// sequelize.
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
// helper.
const funcHelpers = require("../../config/funcHelpers");
const dbHelpers = require("../../config/dbHelpers");
// pagination lib.
const paginate = require("express-paginate");
// express-validate.
const { body, param, validationResult } = require("express-validator");
// request limiter.
const limiter = require("../../config/limiter");

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
              dogAuth: req.session.dogAuth, // authorization.
              admin: req.session.admin, // authorization.
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
      } else if (req.query.filterCategory === "Address") {
        Owner.findAndCountAll({
          // functions in where clause, fancy.
          where: Sequelize.where(
            Sequelize.fn(
              "concat",
              Sequelize.col("streetNumber"),
              " ", // have to include the whitespace between. i.e: JohnDoe != John Doe.
              Sequelize.col("streetName")
            ),
            {
              [Op.like]: "%" + req.query.filterValue + "%",
            }
          ),
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
              dogAuth: req.session.dogAuth, // authorization.
              admin: req.session.admin, // authorization.
              data: results.rows,
              filterCategory: req.query.filterCategory,
              filterValue: req.query.filterValue,
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

            return res.render("dogtags/search/dogTagNumberSearch", {
              title: "BWG | Dog Tags",
              email: req.session.email,
              dogAuth: req.session.dogAuth,
              admin: req.session.admin,
              data: results.rows,
              filterCategory: req.query.filterCategory,
              filterValue: req.query.filterValue,
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
      } else if (req.query.filterCategory === "Additional Owner Name") {
        AdditionalOwner.findAndCountAll({
          where: {
            [Op.or]: {
              firstName: {
                [Op.like]: "%" + req.query.filterValue + "%",
              },
              lastName: {
                [Op.like]: "%" + req.query.filterValue + "%",
              },
            },
          },
        })
          .then((results) => {
            // for pagination.
            const itemCount = results.count;
            const pageCount = Math.ceil(results.count / req.query.limit);

            return res.render("dogtags/search/additionalOwnerSearch", {
              title: "BWG | Dog Tags",
              email: req.session.email,
              dogAuth: req.session.dogAuth,
              admin: req.session.admin,
              data: results.rows,
              filterCategory: req.query.filterCategory,
              filterValue: req.query.filterValue,
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
              message: "Page Error!",
            })
          );
      } else {
        // format filterCategory to match column name in db - via handy dandy camelize() function.
        var filterCategory = funcHelpers.camelize(req.query.filterCategory);

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
              dogAuth: req.session.dogAuth,
              admin: req.session.admin,
              data: results.rows,
              filterCategory: req.query.filterCategory,
              filterValue: req.query.filterValue,
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

      // get addressHistory data.
      var addressHistory = await dbHelpers.getAddressHistory(
        req.session.ownerID
      );
      // get dogHistory data.
      var dogHistory = await dbHelpers.getDogHistory(req.session.ownerID);

      // get ownerName.
      Owner.findOne({
        attributes: ["firstName", "lastName"],
        where: {
          ownerID: req.session.ownerID,
        },
      }).then((results) => {
        // create ownerName from results.
        ownerName = results.firstName + " " + results.lastName;
      });

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
              dogAuth: req.session.dogAuth,
              admin: req.session.admin,
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

/* POST /dogtags/owner/:id page. (renews dogtag) */
router.post(
  "/owner/:id",
  param("id").isNumeric().trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("dogtags/owner", {
        title: "BWG | Owner",
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
          tagNumber: req.body.tagNumber,
          issueDate: issueDate,
          expiryDate: expiryDate,
        },
        {
          where: {
            dogID: req.body.dogID,
          },
        }
      )
        .then(res.redirect("/dogtags/owner/" + req.session.ownerID))
        .catch((err) =>
          res.render("owner", {
            title: "BWG | Owner",
            message: "Page Error! ",
          })
        );
    }
  }
);

/* GET /owner/:id/additionalOwner/:id  */
router.get(
  "/owner/:id/additionalOwner/:additionalOwnerID",
  param("id").isNumeric().trim(),
  param("additionalOwnerID").isNumeric().trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("dogtags/additionalOwner", {
        title: "BWG | Additional Owner",
        message: "Page Error!",
        email: req.session.email,
      });
    } else {
      // check if there's an error message in the session
      let messages = req.session.messages || [];
      // clear session messages
      req.session.messages = [];

      AdditionalOwner.findOne({
        where: {
          additionalOwnerID: req.params.additionalOwnerID,
        },
      }).then((results) => {
        return res.render("dogtags/additionalOwner", {
          title: "BWG | Additional Owner",
          errorMessages: messages,
          email: req.session.email,
          dogAuth: req.session.dogAuth,
          admin: req.session.admin,
          additionalOwnerInfo: {
            firstName: results.firstName,
            lastName: results.lastName,
            town: results.town,
            homePhone: results.homePhone,
            cellPhone: results.cellPhone,
            workPhone: results.workPhone,
            email: results.email,
          },
        });
      });
    }
  }
);

/* POST /owner/:id/additionalOwner/:id  */
router.post(
  "/owner/:id/additionalOwner/:additionalOwnerID",
  param("id").isNumeric().trim(),
  param("additionalOwnerID").isNumeric().trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("dogtags/additionalOwner", {
        title: "BWG | Additional Owner",
        message: "Page Error!",
        email: req.session.email,
      });
    } else {
      // update additionalOwner.
      AdditionalOwner.update(
        {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          town: req.body.town,
          homePhone: req.body.homePhone,
          cellPhone: req.body.cellPhone,
          workPhone: req.body.workPhone,
          email: req.body.email,
        },
        {
          where: {
            additionalOwnerID: req.params.additionalOwnerID,
          },
        }
      )
        .then(res.redirect("/dogtags/owner/" + req.session.ownerID))
        .catch((err) =>
          res.render("dogtags/additionalOwner", {
            title: "BWG | Additional Owner",
            message: "Page Error! ",
          })
        );
    }
  }
);

/* GET /owner/:id/tagHistory/:dogID page. */
router.get(
  "/owner/:id/tagHistory/:dogID",
  param("id").matches(/^\d+$/).trim(),
  param("dogID").matches(/^\d+$/).trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("dogtags/tagHistory", {
        title: "BWG | Tag History",
        message: "Error!",
        email: req.session.email,
      });
    } else {
      // check if there's an error message in the session
      let messages = req.session.messages || [];
      // clear session messages
      req.session.messages = [];

      // set dogID to session.
      req.session.dogID = req.params.dogID;
      // get dogName from dogID.
      var dogName = await dbHelpers.getDogNameFromDogID(req.session.dogID);

      // get tagNumberHistory data.
      var tagNumberHistory = await dbHelpers.getTagNumberHistory(
        req.session.dogID
      );

      // error handle here as user can pass an invalid one in URL bar.
      // if ownerName exists, concatenate names together.
      if (!dogName) {
        return res.render("dogtags/owner", {
          title: "BWG | Owner",
          message: "Owner Lookup Error!",
          email: req.session.email,
        });
      } else {
        // return endpoint after passing validation.
        return res.render("dogtags/tagHistory", {
          title: "BWG | Tag History",
          errorMessages: messages,
          email: req.session.email,
          dogAuth: req.session.dogAuth,
          admin: req.session.admin,
          ownerID: req.session.ownerID,
          dogName: dogName[0].dogName,
          tagNumberHistory: tagNumberHistory,
        });
      }
    }
  }
);

/* GET /dogtags/expiredTags */
router.get(
  "/expiredTags",
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
      return res.render("dogtags/expiredTags", {
        title: "BWG | Expired Tags",
        message: "Error!",
        email: req.session.email,
      });
    } else {
      // check if there's an error message in the session
      let messages = req.session.messages || [];
      // clear session messages
      req.session.messages = [];

      // get dropdown values.
      var dropdownValues = await Dropdown.findAll({
        where: {
          dropdownFormID: 1,
        },
      });

      // if there are no filter parameters.
      if (!req.query.filterCategory || !req.query.filterValue) {
        Owner.findAndCountAll({
          limit: req.query.limit,
          offset: req.skip,
          include: [
            {
              model: Address,
            },
            {
              model: Dog,
              where: {
                expiryDate: {
                  [Op.lte]: Date.now(),
                },
              },
            },
          ],
          group: "firstName",
          order: [["ownerID", "ASC"]],
        }).then((results) => {
          // for pagination.
          const itemCount = results.count.length;
          const pageCount = Math.ceil(results.count.length / req.query.limit);

          // return endpoint after passing validation.
          return res.render("dogtags/expiredTags", {
            title: "BWG | Expired Tags",
            errorMessages: messages,
            email: req.session.email,
            dogAuth: req.session.dogAuth,
            admin: req.session.admin,
            ownerID: req.session.ownerID,
            data: results.rows,
            dropdownValues: dropdownValues,
            pageCount,
            itemCount,
            queryCount: "Records returned: " + results.count.length,
            pages: paginate.getArrayPages(req)(5, pageCount, req.query.page),
            prev: paginate.href(req)(true),
            hasMorePages: paginate.hasNextPages(req)(pageCount),
          });
        });
      } else if (req.query.filterCategory === "Address") {
        Owner.findAndCountAll({
          limit: req.query.limit,
          offset: req.skip,
          include: [
            {
              model: Address,
              where: Sequelize.where(
                Sequelize.fn(
                  "concat",
                  Sequelize.col("streetNumber"),
                  " ", // have to include the whitespace between. i.e: JohnDoe != John Doe.
                  Sequelize.col("streetName")
                ),
                {
                  [Op.like]: "%" + req.query.filterValue + "%",
                }
              ),
            },
            {
              model: Dog,
              where: {
                expiryDate: {
                  [Op.lte]: Date.now(),
                },
              },
            },
          ],
          group: "firstName",
          order: [["ownerID", "ASC"]],
        }).then((results) => {
          // for pagination.
          const itemCount = results.count.length;
          const pageCount = Math.ceil(results.count.length / req.query.limit);

          // return endpoint after passing validation.
          return res.render("dogtags/expiredTags", {
            title: "BWG | Expired Tags",
            errorMessages: messages,
            email: req.session.email,
            dogAuth: req.session.dogAuth,
            admin: req.session.admin,
            ownerID: req.session.ownerID,
            data: results.rows,
            dropdownValues: dropdownValues,
            filterCategory: req.query.filterCategory,
            filterValue: req.query.filterValue,
            pageCount,
            itemCount,
            queryCount: "Records returned: " + results.count.length,
            pages: paginate.getArrayPages(req)(5, pageCount, req.query.page),
            prev: paginate.href(req)(true),
            hasMorePages: paginate.hasNextPages(req)(pageCount),
          });
        });
      } else if (req.query.filterCategory === "Dog Tag Number") {
        Owner.findAndCountAll({
          limit: req.query.limit,
          offset: req.skip,
          include: [
            {
              model: Address,
            },
            {
              model: Dog,
              where: {
                expiryDate: {
                  [Op.lte]: Date.now(),
                },
                [Op.and]: {
                  tagNumber: req.query.filterValue,
                },
              },
            },
          ],
          group: "firstName",
          order: [["ownerID", "ASC"]],
        }).then((results) => {
          // for pagination.
          const itemCount = results.count.length;
          const pageCount = Math.ceil(results.count.length / req.query.limit);

          // return endpoint after passing validation.
          return res.render("dogtags/expiredTags", {
            title: "BWG | Expired Tags",
            errorMessages: messages,
            email: req.session.email,
            dogAuth: req.session.dogAuth,
            admin: req.session.admin,
            ownerID: req.session.ownerID,
            data: results.rows,
            dropdownValues: dropdownValues,
            filterCategory: req.query.filterCategory,
            filterValue: req.query.filterValue,
            pageCount,
            itemCount,
            queryCount: "Records returned: " + results.count.length,
            pages: paginate.getArrayPages(req)(5, pageCount, req.query.page),
            prev: paginate.href(req)(true),
            hasMorePages: paginate.hasNextPages(req)(pageCount),
          });
        });
      } else if (req.query.filterCategory === "Additional Owner Name") {
        Owner.findAndCountAll({
          limit: req.query.limit,
          offset: req.skip,
          include: [
            {
              model: Address,
            },
            {
              model: AdditionalOwner,
              where: {
                [Op.or]: {
                  firstName: {
                    [Op.like]: "%" + req.query.filterValue + "%",
                  },
                  lastName: {
                    [Op.like]: "%" + req.query.filterValue + "%",
                  },
                },
              },
            },
            {
              model: Dog,
            },
          ],
          order: [["ownerID", "ASC"]],
        }).then((results) => {
          // for pagination.
          const itemCount = results.count;
          const pageCount = Math.ceil(results.count / req.query.limit);

          // return endpoint after passing validation.
          return res.render("dogtags/expiredTags", {
            title: "BWG | Expired Tags",
            errorMessages: messages,
            email: req.session.email,
            dogAuth: req.session.dogAuth,
            admin: req.session.admin,
            ownerID: req.session.ownerID,
            data: results.rows,
            dropdownValues: dropdownValues,
            filterCategory: req.query.filterCategory,
            filterValue: req.query.filterValue,
            pageCount,
            itemCount,
            queryCount: "Records returned: " + results.count,
            pages: paginate.getArrayPages(req)(5, pageCount, req.query.page),
            prev: paginate.href(req)(true),
            hasMorePages: paginate.hasNextPages(req)(pageCount),
          });
        });
      } else {
        // format filterCategory to match column name in db - via handy dandy camelize() function.
        var filterCategory = funcHelpers.camelize(req.query.filterCategory);

        Owner.findAndCountAll({
          limit: req.query.limit,
          offset: req.skip,
          where: {
            [filterCategory]: {
              [Op.like]: req.query.filterValue + "%",
            },
          },
          include: [
            {
              model: Address,
            },
            {
              model: Dog,
              where: {
                expiryDate: {
                  [Op.lte]: Date.now(),
                },
              },
            },
          ],
          group: "firstName",
          order: [["ownerID", "ASC"]],
        }).then((results) => {
          // for pagination.
          const itemCount = results.count.length;
          const pageCount = Math.ceil(results.count.length / req.query.limit);

          // return endpoint after passing validation.
          return res.render("dogtags/expiredTags", {
            title: "BWG | Expired Tags",
            errorMessages: messages,
            email: req.session.email,
            dogAuth: req.session.dogAuth,
            admin: req.session.admin,
            ownerID: req.session.ownerID,
            data: results.rows,
            dropdownValues: dropdownValues,
            filterCategory: req.query.filterCategory,
            filterValue: req.query.filterValue,
            pageCount,
            itemCount,
            queryCount: "Records returned: " + results.count.length,
            pages: paginate.getArrayPages(req)(5, pageCount, req.query.page),
            prev: paginate.href(req)(true),
            hasMorePages: paginate.hasNextPages(req)(pageCount),
          });
        });
      }
    }
  }
);

module.exports = router;
