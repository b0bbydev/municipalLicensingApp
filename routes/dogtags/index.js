var express = require("express");
var router = express.Router();
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
        auth: req.session.auth, // authorization.
      });
    } else {
      // check if there's an error message in the session
      let messages = req.session.messages || [];
      // clear session messages
      req.session.messages = [];
      // delete session lastEnteredDropdownTitle.
      delete req.session.lastEnteredDropdownTitle;

      // get filtering options.
      var filterOptions = await Dropdown.findAll({
        where: {
          dropdownFormID: 29, // filtering options.
          dropdownTitle: "Dog Owner Filtering Options",
        },
      });

      // if there are no filter parameters.
      if (!req.query.filterCategory || !req.query.filterValue) {
        // get all owners & addresses.
        Owner.findAndCountAll({
          limit: req.query.limit,
          offset: req.skip,
          order: [["ownerID", "DESC"]],
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

            return res.render("dogtags/index", {
              title: "BWG | Dog Tags",
              message: messages,
              email: req.session.email,
              auth: req.session.auth, // authorization.
              data: results.rows,
              filterOptions: filterOptions,
              currentPage: req.query.page,
              pageCount,
              itemCount,
              queryCount: "Records returned: " + results.count,
              pages: paginate.getArrayPages(req)(5, pageCount, req.query.page),
              prev: paginate.href(req)(true),
              hasMorePages: paginate.hasNextPages(req)(pageCount),
            });
          })
          // catch any scary errors and render page error.
          .catch((err) => {
            return res.render("dogtags/index", {
              title: "BWG | Dog Tags",
              message: "Page Error!",
              auth: req.session.auth, // authorization.
            });
          });
      } else if (req.query.filterCategory === "Address") {
        Owner.findAndCountAll({
          limit: req.query.limit,
          offset: req.skip,
          subQuery: false, // adding this gets rid of the 'unknown column' error caused when adding limit & offset.
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
              message: messages,
              email: req.session.email,
              auth: req.session.auth, // authorization.
              data: results.rows,
              filterCategory: req.query.filterCategory,
              filterValue: req.query.filterValue,
              filterOptions: filterOptions,
              currentPage: req.query.page,
              pageCount,
              itemCount,
              queryCount: "Records returned: " + results.count,
              pages: paginate.getArrayPages(req)(5, pageCount, req.query.page),
              prev: paginate.href(req)(true),
              hasMorePages: paginate.hasNextPages(req)(pageCount),
            });
          })
          // catch any scary errors and render page error.
          .catch((err) => {
            return res.render("dogtags/index", {
              title: "BWG | Dog Tags",
              message: "Page Error!",
              auth: req.session.auth, // authorization.
            });
          });
        // use a different function (SQL query) if filtering by tagNumber.
      } else if (req.query.filterCategory === "Dog Tag Number") {
        Owner.findAndCountAll({
          subQuery: false, // fixes column not found error when paginating a join.
          limit: req.query.limit,
          offset: req.skip,
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
              auth: req.session.auth, // authorization.
              data: results.rows,
              filterCategory: req.query.filterCategory,
              filterValue: req.query.filterValue,
              filterOptions: filterOptions,
              currentPage: req.query.page,
              pageCount,
              itemCount,
              queryCount: "Records returned: " + results.count,
              pages: paginate.getArrayPages(req)(5, pageCount, req.query.page),
              prev: paginate.href(req)(true),
              hasMorePages: paginate.hasNextPages(req)(pageCount),
            });
          })
          // catch any scary errors and render page error.
          .catch((err) => {
            return res.render("dogtags/search/dogTagNumberSearch", {
              title: "BWG | Dog Tags",
              message: "Page Error!",
              auth: req.session.auth, // authorization.
            });
          });
      } else if (req.query.filterCategory === "Additional Owner Name") {
        Owner.findAndCountAll({
          subQuery: false, // fixes column not found error when paginating a join.
          limit: req.query.limit,
          offset: req.skip,
          where: {
            [Op.or]: {
              "$AdditionalOwner.firstName$": {
                [Op.like]: "%" + req.query.filterValue + "%",
              },
              "$AdditionalOwner.lastName$": {
                [Op.like]: "%" + req.query.filterValue + "%",
              },
            },
          },
          include: [
            {
              model: AdditionalOwner,
              as: "AdditionalOwner",
            },
          ],
        })
          .then((results) => {
            // for pagination.
            const itemCount = results.count;
            const pageCount = Math.ceil(results.count / req.query.limit);

            return res.render("dogtags/search/additionalOwnerSearch", {
              title: "BWG | Dog Tags",
              email: req.session.email,
              auth: req.session.auth, // authorization.
              data: results.rows,
              filterCategory: req.query.filterCategory,
              filterValue: req.query.filterValue,
              filterOptions: filterOptions,
              currentPage: req.query.page,
              pageCount,
              itemCount,
              queryCount: "Records returned: " + results.count,
              pages: paginate.getArrayPages(req)(5, pageCount, req.query.page),
              prev: paginate.href(req)(true),
              hasMorePages: paginate.hasNextPages(req)(pageCount),
            });
          })
          // catch any scary errors and render page error.
          .catch((err) => {
            return res.render("dogtags/search/additionalOwnerSearch", {
              title: "BWG | Dog Tags",
              message: "Page Error!",
              auth: req.session.auth, // authorization.
            });
          });
      } else if (req.query.filterCategory === "Vendor") {
        Owner.findAndCountAll({
          subQuery: false, // fixes column not found error when paginating a join.
          limit: req.query.limit,
          offset: req.skip,
          where: {
            $vendor$: {
              [Op.like]: "%" + req.query.filterValue + "%",
            },
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

            return res.render("dogtags/search/vendorSearch", {
              title: "BWG | Dog Tags",
              email: req.session.email,
              auth: req.session.auth, // authorization.
              data: results.rows,
              filterCategory: req.query.filterCategory,
              filterValue: req.query.filterValue,
              filterOptions: filterOptions,
              currentPage: req.query.page,
              pageCount,
              itemCount,
              queryCount: "Records returned: " + results.count,
              pages: paginate.getArrayPages(req)(5, pageCount, req.query.page),
              prev: paginate.href(req)(true),
              hasMorePages: paginate.hasNextPages(req)(pageCount),
            });
          })
          // catch any scary errors and render page error.
          .catch((err) => {
            return res.render("dogtags/index", {
              title: "BWG | Dog Tags",
              message: "Page Error!",
              auth: req.session.auth, // authorization.
            });
          });
      } else if (req.query.filterCategory === "Dog Name") {
        Owner.findAndCountAll({
          subQuery: false, // fixes column not found error when paginating a join.
          limit: req.query.limit,
          offset: req.skip,
          where: {
            $dogName$: {
              [Op.like]: "%" + req.query.filterValue + "%",
            },
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

            return res.render("dogtags/search/dogNameSearch", {
              title: "BWG | Dog Tags",
              email: req.session.email,
              auth: req.session.auth, // authorization.
              data: results.rows,
              filterCategory: req.query.filterCategory,
              filterValue: req.query.filterValue,
              filterOptions: filterOptions,
              currentPage: req.query.page,
              pageCount,
              itemCount,
              queryCount: "Records returned: " + results.count,
              pages: paginate.getArrayPages(req)(5, pageCount, req.query.page),
              prev: paginate.href(req)(true),
              hasMorePages: paginate.hasNextPages(req)(pageCount),
            });
          })
          // catch any scary errors and render page error.
          .catch((err) => {
            return res.render("dogtags/index", {
              title: "BWG | Dog Tags",
              message: "Page Error!",
              auth: req.session.auth, // authorization.
            });
          });
      } else if (req.query.filterCategory === "Owner Name") {
        // checks to see if input contains more than 1 word. i.e: "firstName + lastName"
        if (req.query.filterValue.trim().indexOf(" ") != -1) {
          Owner.findAndCountAll({
            subQuery: false, // fixes column not found error when paginating a join.
            limit: req.query.limit,
            offset: req.skip,
            where: Sequelize.where(
              Sequelize.fn(
                "concat",
                Sequelize.col("firstName"),
                " ", // have to include the whitespace between. i.e: JohnDoe != John Doe.
                Sequelize.col("lastName")
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
                message: messages,
                email: req.session.email,
                auth: req.session.auth, // authorization.
                data: results.rows,
                filterCategory: req.query.filterCategory,
                filterValue: req.query.filterValue,
                filterOptions: filterOptions,
                currentPage: req.query.page,
                pageCount,
                itemCount,
                queryCount: "Records returned: " + results.count,
                pages: paginate.getArrayPages(req)(
                  5,
                  pageCount,
                  req.query.page
                ),
                prev: paginate.href(req)(true),
                hasMorePages: paginate.hasNextPages(req)(pageCount),
              });
            })
            // catch any scary errors and render page error.
            .catch((err) => {
              return res.render("dogtags/index", {
                title: "BWG | Dog Tags",
                message: "Page Error!",
                auth: req.session.auth, // authorization.
              });
            });
        } else {
          Owner.findAndCountAll({
            subQuery: false, // fixes column not found error when paginating a join.
            limit: req.query.limit,
            offset: req.skip,
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
                message: messages,
                email: req.session.email,
                auth: req.session.auth, // authorization.
                data: results.rows,
                filterCategory: req.query.filterCategory,
                filterValue: req.query.filterValue,
                filterOptions: filterOptions,
                currentPage: req.query.page,
                pageCount,
                itemCount,
                queryCount: "Records returned: " + results.count,
                pages: paginate.getArrayPages(req)(
                  5,
                  pageCount,
                  req.query.page
                ),
                prev: paginate.href(req)(true),
                hasMorePages: paginate.hasNextPages(req)(pageCount),
              });
            })
            // catch any scary errors and render page error.
            .catch((err) => {
              return res.render("dogtags/index", {
                title: "BWG | Dog Tags",
                message: "Page Error!",
                auth: req.session.auth, // authorization.
              });
            });
        }
      } else if (req.query.filterCategory === "Dangerous Dogs") {
        Owner.findAndCountAll({
          limit: req.query.limit,
          offset: req.skip,
          subQuery: false, // adding this gets rid of the 'unknown column' error caused when adding limit & offset.
          include: [
            {
              model: Dog,
            },
            {
              model: Address,
            },
          ],
          where: {
            $designation$: {
              [Op.like]: "Dangerous",
            },
          },
        })
          .then((results) => {
            // for pagination.
            const itemCount = results.count;
            const pageCount = Math.ceil(results.count / req.query.limit);

            return res.render("dogtags", {
              title: "BWG | Dog Tags",
              message: messages,
              email: req.session.email,
              auth: req.session.auth, // authorization.
              data: results.rows,
              filterCategory: req.query.filterCategory,
              filterValue: req.query.filterValue,
              filterOptions: filterOptions,
              currentPage: req.query.page,
              pageCount,
              itemCount,
              queryCount: "Records returned: " + results.count,
              pages: paginate.getArrayPages(req)(5, pageCount, req.query.page),
              prev: paginate.href(req)(true),
              hasMorePages: paginate.hasNextPages(req)(pageCount),
            });
          })
          // catch any scary errors and render page error.
          .catch((err) => {
            return res.render("dogtags/index", {
              title: "BWG | Dog Tags",
              message: "Page Error!",
              auth: req.session.auth, // authorization.
            });
          });
      } else {
        // format filterCategory to match column name in db - via handy dandy camelize() function.
        var filterCategory = funcHelpers.camelize(req.query.filterCategory);

        // create filter query.
        Owner.findAndCountAll({
          subQuery: false, // fixes column not found error when paginating a join.
          limit: req.query.limit,
          offset: req.skip,
          where: {
            [filterCategory]: {
              [Op.like]: "%" + req.query.filterValue + "%",
            },
          },
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
              message: messages,
              email: req.session.email,
              auth: req.session.auth, // authorization.
              data: results.rows,
              filterCategory: req.query.filterCategory,
              filterValue: req.query.filterValue,
              filterOptions: filterOptions,
              currentPage: req.query.page,
              pageCount,
              itemCount,
              queryCount: "Records returned: " + results.count,
              pages: paginate.getArrayPages(req)(5, pageCount, req.query.page),
              prev: paginate.href(req)(true),
              hasMorePages: paginate.hasNextPages(req)(pageCount),
            });
          })
          // catch any scary errors and render page error.
          .catch((err) => {
            return res.render("dogtags/index", {
              title: "BWG | Dog Tags",
              message: "Page Error!",
              auth: req.session.auth, // authorization.
            });
          });
      }
    }
  }
);

/* GET owner page. */
router.get(
  "/owner/:id",
  param("id").matches(/^\d+$/).trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("dogtags", {
        title: "BWG | Owner",
        message: "Page Error!",
        email: req.session.email,
        auth: req.session.auth, // authorization.
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

      // get current date.
      var issueDate = new Date();
      // init expiryDate.
      var modalExpiryDate = new Date();

      // if issueDate is in November or December.
      if (issueDate.getMonth() === 10 || issueDate.getMonth() === 11) {
        modalExpiryDate = new Date(issueDate.getFullYear() + 2, 0, 31);
      } else {
        modalExpiryDate = new Date(issueDate.getFullYear() + 1, 0, 31); // year, month (jan = 0), day
      }

      // get ownerName.
      Owner.findOne({
        attributes: ["firstName", "lastName"],
        where: {
          ownerID: req.session.ownerID,
        },
      }).then((results) => {
        // create ownerName from results if valid.
        if (results) {
          ownerName = results.firstName + " " + results.lastName;
        } else {
          ownerName = null;
        }
      });

      AdditionalOwner.findAndCountAll({
        where: {
          ownerID: req.session.ownerID,
        },
      }).then((additionalOwners) => {
        Dog.findAndCountAll({
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
              message: messages,
              email: req.session.email,
              auth: req.session.auth, // authorization.
              ownerName: ownerName,
              ownerID: req.session.ownerID,
              queryCount: "Dog(s) on record: " + results.count,
              data: results.rows,
              additionalOwners: additionalOwners.rows,
              addressHistory: addressHistory,
              dogHistory: dogHistory,
              modalExpiryDate: modalExpiryDate,
              dogtagUrl: req.session.dogtagUrl,
              currentPage: req.query.page,
              pageCount,
              itemCount,
              pages: paginate.getArrayPages(req)(5, pageCount, req.query.page),
              prev: paginate.href(req)(true),
              hasMorePages: paginate.hasNextPages(req)(pageCount),
            });
          })
          // catch any scary errors and render page error.
          .catch((err) => {
            return res.render("dogtags/owner", {
              title: "BWG | Dog Tags",
              message: "Page Error!",
              auth: req.session.auth, // authorization.
            });
          });
      });
    }
  }
);

/* POST /dogtags/owner/:id (renews dogtag) */
router.post(
  "/owner/:id",
  param("id").matches(/^\d+$/).trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("dogtags/owner", {
        title: "BWG | Owner",
        message: "Page Error!",
        email: req.session.email,
        auth: req.session.auth, // authorization.
      });
    } else {
      // get current date for automatic population of license.
      var issueDate = new Date();
      // init expiryDate.
      var expiryDate = new Date();

      // if issueDate is in November or December.
      if (issueDate.getMonth() === 10 || issueDate.getMonth() === 11) {
        expiryDate = new Date(issueDate.getFullYear() + 2, 0, 31);
      } else {
        expiryDate = new Date(issueDate.getFullYear() + 1, 0, 31); // year, month (jan = 0), day
      }

      // no errors, update license.
      Dog.update(
        {
          tagNumber: req.body.tagNumber,
          vendor: req.body.vendor,
          issueDate: issueDate,
          expiryDate: expiryDate,
        },
        {
          where: {
            dogID: req.body.dogID,
          },
        }
      )
        .then(() => {
          return res.redirect("/dogtags/owner/" + req.session.ownerID);
        })
        .catch((err) => {
          return res.render("dogtags/owner", {
            title: "BWG | Dog Tags",
            message: "Page Error!",
            auth: req.session.auth, // authorization.
          });
        });
    }
  }
);

/* GET /owner/:id/additionalOwner/:id  */
router.get(
  "/owner/:id/additionalOwner/:additionalOwnerID",
  param("id").matches(/^\d+$/).trim(),
  param("additionalOwnerID").matches(/^\d+$/).trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("dogtags/additionalOwner", {
        title: "BWG | Additional Owner",
        message: "Page Error!",
        email: req.session.email,
        auth: req.session.auth, // authorization.
      });
    } else {
      // check if there's an error message in the session
      let messages = req.session.messages || [];
      // clear session messages
      req.session.messages = [];

      // populate input fields with existing values.
      AdditionalOwner.findOne({
        where: {
          additionalOwnerID: req.params.additionalOwnerID,
        },
      })
        .then((results) => {
          return res.render("dogtags/additionalOwner", {
            title: "BWG | Additional Owner",
            message: messages,
            email: req.session.email,
            auth: req.session.auth, // authorization.
            // existing values.
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
        })
        .catch((err) => {
          return res.render("dogtags/additionalOwner", {
            title: "BWG | Additional Owner",
            message: "Page Error!",
            auth: req.session.auth, // authorization.
          });
        });
    }
  }
);

/* POST /owner/:id/additionalOwner/:id  */
router.post(
  "/owner/:id/additionalOwner/:additionalOwnerID",
  param("id").matches(/^\d+$/).trim(),
  param("additionalOwnerID").matches(/^\d+$/).trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("dogtags/additionalOwner", {
        title: "BWG | Additional Owner",
        message: "Page Error!",
        email: req.session.email,
        auth: req.session.auth, // authorization.
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
        .then(() => {
          return res.redirect("/dogtags/owner/" + req.session.ownerID);
        })
        .catch((err) => {
          return res.render("dogtags/additionalOwner", {
            title: "BWG | Additional Owner",
            message: "Page Error!",
            auth: req.session.auth, // authorization.
          });
        });
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
        auth: req.session.auth, // authorization.
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
          message: messages,
          email: req.session.email,
          auth: req.session.auth, // authorization.
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
        auth: req.session.auth, // authorization.
      });
    } else {
      // check if there's an error message in the session
      let messages = req.session.messages || [];
      // clear session messages
      req.session.messages = [];

      // get dropdown values.
      var filterOptions = await Dropdown.findAll({
        where: {
          dropdownFormID: 29, // filtering options.
          dropdownTitle: "Dog Owner Filtering Options",
        },
      });

      /* logic for getting expired tags between x and x years. */
      // get current year.
      const currentYear = new Date().getFullYear();

      // set the date for Jan.31 of the current year.
      const currentYearJan31 = new Date(currentYear, 0, 31);

      // set the date five years previous from the current date on Jan.1
      const fiveYearsAgoJan1 = new Date(currentYear - 5, 0, 1);

      // format dates as strings in the 'YYYY-MM-DD' format as that's what is in the db.
      const formattedCurrentYearJan31 = currentYearJan31
        .toISOString()
        .split("T")[0];
      const formattedFiveYearsAgoJan1 = fiveYearsAgoJan1
        .toISOString()
        .split("T")[0];

      // if there are no filter parameters.
      if (!req.query.filterCategory || !req.query.filterValue) {
        Owner.findAndCountAll({
          limit: req.query.limit,
          offset: req.skip,
          include: [
            {
              model: Dog,
              where: {
                expiryDate: {
                  [Op.gt]: formattedFiveYearsAgoJan1,
                  [Op.lte]: formattedCurrentYearJan31,
                },
                [Op.or]: [
                  { tagRequired: null },
                  {
                    [Op.and]: [
                      { tagRequired: { [Op.notLike]: "%deceased%" } },
                      { tagRequired: { [Op.notLike]: "%moved%" } },
                    ],
                  },
                ],
              },
              // makes the query an inner join.
              required: true,
            },
            {
              model: Address,
              // makes the query an inner join.
              required: true,
            },
          ],
          group: ["Owner.ownerID"],
          order: [["ownerID", "ASC"]],
        })
          .then((results) => {
            // for pagination.
            const itemCount = results.count;
            const pageCount = Math.ceil(results.count.length / req.query.limit);

            // return endpoint after passing validation.
            return res.render("dogtags/expiredTags", {
              title: "BWG | Expired Tags",
              message: messages,
              email: req.session.email,
              auth: req.session.auth, // authorization.
              ownerID: req.session.ownerID,
              data: results.rows,
              filterOptions: filterOptions,
              currentPage: req.query.page,
              pageCount,
              itemCount,
              queryCount: "Records returned: " + results.count.length,
              pages: paginate.getArrayPages(req)(5, pageCount, req.query.page),
              prev: paginate.href(req)(true),
              hasMorePages: paginate.hasNextPages(req)(pageCount),
            });
          })
          .catch((err) => {
            return res.render("dogtags/expiredTags", {
              title: "BWG | Dog Tags",
              message: "Page Error!",
              auth: req.session.auth, // authorization.
            });
          });
      } else if (req.query.filterCategory === "Address") {
        Owner.findAndCountAll({
          limit: req.query.limit,
          offset: req.skip,
          subQuery: false, // adding this gets rid of the 'unknown column' error caused when adding limit & offset.
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
          // group on first name because owners will appear more than once
          // depending on if they have more than 1 dog that is expired.
          group: ["Owner.ownerID"],
          order: [["ownerID", "ASC"]],
        })
          .then((results) => {
            // for pagination.
            const itemCount = results.count.length;
            const pageCount = Math.ceil(results.count.length / req.query.limit);

            // return endpoint after passing validation.
            return res.render("dogtags/expiredTags", {
              title: "BWG | Expired Tags",
              message: messages,
              email: req.session.email,
              auth: req.session.auth, // authorization.
              ownerID: req.session.ownerID,
              data: results.rows,
              filterOptions: filterOptions,
              filterCategory: req.query.filterCategory,
              filterValue: req.query.filterValue,
              currentPage: req.query.page,
              pageCount,
              itemCount,
              queryCount: "Records returned: " + results.count.length,
              pages: paginate.getArrayPages(req)(5, pageCount, req.query.page),
              prev: paginate.href(req)(true),
              hasMorePages: paginate.hasNextPages(req)(pageCount),
            });
          })
          .catch((err) => {
            return res.render("dogtags/expiredTags", {
              title: "BWG | Dog Tags",
              message: "Page Error!",
              auth: req.session.auth, // authorization.
            });
          });
      } else if (req.query.filterCategory === "Dog Tag Number") {
        Owner.findAndCountAll({
          limit: req.query.limit,
          offset: req.skip,
          subQuery: false, // adding this gets rid of the 'unknown column' error caused when adding limit & offset.
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
          // group on first name because owners will appear more than once
          // depending on if they have more than 1 dog that is expired.
          group: ["Owner.ownerID"],
          order: [["ownerID", "ASC"]],
        })
          .then((results) => {
            // for pagination.
            const itemCount = results.count.length;
            const pageCount = Math.ceil(results.count.length / req.query.limit);

            // return endpoint after passing validation.
            return res.render("dogtags/expiredTags", {
              title: "BWG | Expired Tags",
              message: messages,
              email: req.session.email,
              auth: req.session.auth, // authorization.
              ownerID: req.session.ownerID,
              data: results.rows,
              filterOptions: filterOptions,
              filterCategory: req.query.filterCategory,
              filterValue: req.query.filterValue,
              currentPage: req.query.page,
              pageCount,
              itemCount,
              queryCount: "Records returned: " + results.count.length,
              pages: paginate.getArrayPages(req)(5, pageCount, req.query.page),
              prev: paginate.href(req)(true),
              hasMorePages: paginate.hasNextPages(req)(pageCount),
            });
          })
          .catch((err) => {
            return res.render("dogtags/expiredTags", {
              title: "BWG | Dog Tags",
              message: "Page Error!",
              auth: req.session.auth, // authorization.
            });
          });
      } else if (req.query.filterCategory === "Additional Owner Name") {
        Owner.findAndCountAll({
          limit: req.query.limit,
          offset: req.skip,
          subQuery: false, // adding this gets rid of the 'unknown column' error caused when adding limit & offset.
          where: {
            [Op.or]: {
              "$AdditionalOwner.firstName$": {
                [Op.like]: "%" + req.query.filterValue + "%",
              },
              "$AdditionalOwner.lastName$": {
                [Op.like]: "%" + req.query.filterValue + "%",
              },
            },
          },
          include: [
            {
              model: AdditionalOwner,
              as: "AdditionalOwner",
            },
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
          // group on first name because owners will appear more than once
          // depending on if they have more than 1 dog that is expired.
          group: "AdditionalOwner.ownerID",
          order: [["ownerID", "ASC"]],
        })
          .then((results) => {
            // for pagination.
            const itemCount = results.count.length;
            const pageCount = Math.ceil(results.count.length / req.query.limit);

            // return endpoint after passing validation.
            return res.render("dogtags/search/additionalOwnerSearch", {
              title: "BWG | Expired Tags",
              message: messages,
              email: req.session.email,
              auth: req.session.auth, // authorization.
              ownerID: req.session.ownerID,
              data: results.rows,
              filterOptions: filterOptions,
              filterCategory: req.query.filterCategory,
              filterValue: req.query.filterValue,
              currentPage: req.query.page,
              pageCount,
              itemCount,
              queryCount: "Records returned: " + results.count.length,
              pages: paginate.getArrayPages(req)(5, pageCount, req.query.page),
              prev: paginate.href(req)(true),
              hasMorePages: paginate.hasNextPages(req)(pageCount),
            });
          })
          .catch((err) => {
            return res.render("dogtags/expiredTags", {
              title: "BWG | Dog Tags",
              message: "Page Error!",
              auth: req.session.auth, // authorization.
            });
          });
      } else if (req.query.filterCategory === "Owner Name") {
        // checks to see if input contains more than 1 word. i.e: "firstName + lastName"
        if (req.query.filterValue.trim().indexOf(" ") != -1) {
          Owner.findAndCountAll({
            limit: req.query.limit,
            offset: req.skip,
            subQuery: false, // adding this gets rid of the 'unknown column' error caused when adding limit & offset.
            where: Sequelize.where(
              Sequelize.fn(
                "concat",
                Sequelize.col("firstName"),
                " ", // have to include the whitespace between. i.e: JohnDoe != John Doe.
                Sequelize.col("lastName")
              ),
              {
                [Op.like]: "%" + req.query.filterValue + "%",
              }
            ),
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
            // group on first name because owners will appear more than once
            // depending on if they have more than 1 dog that is expired.
            group: ["Owner.ownerID"],
            order: [["ownerID", "ASC"]],
          })
            .then((results) => {
              // for pagination.
              const itemCount = results.count.length;
              const pageCount = Math.ceil(
                results.count.length / req.query.limit
              );

              return res.render("dogtags/expiredTags", {
                title: "BWG | Dog Tags",
                message: messages,
                email: req.session.email,
                auth: req.session.auth, // authorization.
                data: results.rows,
                filterCategory: req.query.filterCategory,
                filterValue: req.query.filterValue,
                filterOptions: filterOptions,
                currentPage: req.query.page,
                pageCount,
                itemCount,
                queryCount: "Records returned: " + results.count.length,
                pages: paginate.getArrayPages(req)(
                  5,
                  pageCount,
                  req.query.page
                ),
                prev: paginate.href(req)(true),
                hasMorePages: paginate.hasNextPages(req)(pageCount),
              });
            })
            // catch any scary errors and render page error.
            .catch((err) => {
              return res.render("dogtags/expiredTags", {
                title: "BWG | Dog Tags",
                message: "Page Error!",
                auth: req.session.auth, // authorization.
              });
            });
        } else {
          Owner.findAndCountAll({
            limit: req.query.limit,
            offset: req.skip,
            subQuery: false, // adding this gets rid of the 'unknown column' error caused when adding limit & offset.
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
            // group on first name because owners will appear more than once
            // depending on if they have more than 1 dog that is expired.
            group: ["Owner.ownerID"],
            order: [["ownerID", "ASC"]],
          })
            .then((results) => {
              // for pagination.
              const itemCount = results.count.length;
              const pageCount = Math.ceil(
                results.count.length / req.query.limit
              );

              return res.render("dogtags/expiredTags", {
                title: "BWG | Dog Tags",
                message: messages,
                email: req.session.email,
                auth: req.session.auth, // authorization.
                data: results.rows,
                filterCategory: req.query.filterCategory,
                filterValue: req.query.filterValue,
                filterOptions: filterOptions,
                currentPage: req.query.page,
                pageCount,
                itemCount,
                queryCount: "Records returned: " + results.count.length,
                pages: paginate.getArrayPages(req)(
                  5,
                  pageCount,
                  req.query.page
                ),
                prev: paginate.href(req)(true),
                hasMorePages: paginate.hasNextPages(req)(pageCount),
              });
            })
            // catch any scary errors and render page error.
            .catch((err) => {
              return res.render("dogtags/expiredTags", {
                title: "BWG | Dog Tags",
                message: "Page Error!",
                auth: req.session.auth, // authorization.
              });
            });
        }
      } else if (req.query.filterCategory === "Vendor") {
        Owner.findAndCountAll({
          limit: req.query.limit,
          offset: req.skip,
          subQuery: false, // adding this gets rid of the 'unknown column' error caused when adding limit & offset.
          where: {
            $vendor$: {
              [Op.like]: "%" + req.query.filterValue + "%",
            },
          },
          include: [
            {
              model: Dog,
              where: {
                expiryDate: {
                  [Op.lte]: Date.now(),
                },
              },
            },
            {
              model: Address,
            },
          ],
          // group on first name because owners will appear more than once
          // depending on if they have more than 1 dog that is expired.
          group: ["Owner.ownerID"],
          order: [["ownerID", "ASC"]],
        })
          .then((results) => {
            // for pagination.
            const itemCount = results.count.length;
            const pageCount = Math.ceil(results.count.length / req.query.limit);

            return res.render("dogtags/expiredTags", {
              title: "BWG | Dog Tags",
              email: req.session.email,
              auth: req.session.auth, // authorization.
              data: results.rows,
              filterCategory: req.query.filterCategory,
              filterValue: req.query.filterValue,
              filterOptions: filterOptions,
              currentPage: req.query.page,
              pageCount,
              itemCount,
              queryCount: "Records returned: " + results.count.length,
              pages: paginate.getArrayPages(req)(5, pageCount, req.query.page),
              prev: paginate.href(req)(true),
              hasMorePages: paginate.hasNextPages(req)(pageCount),
            });
          })
          // catch any scary errors and render page error.
          .catch((err) => {
            return res.render("dogtags/expiredTags", {
              title: "BWG | Dog Tags",
              message: "Page Error!",
              auth: req.session.auth, // authorization.
            });
          });
      } else {
        // format filterCategory to match column name in db - via handy dandy camelize() function.
        var filterCategory = funcHelpers.camelize(req.query.filterCategory);

        Owner.findAndCountAll({
          limit: req.query.limit,
          offset: req.skip,
          subQuery: false, // adding this gets rid of the 'unknown column' error caused when adding limit & offset.
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
          // group on first name because owners will appear more than once
          // depending on if they have more than 1 dog that is expired.
          group: ["Owner.ownerID"],
          order: [["ownerID", "ASC"]],
        })
          .then((results) => {
            // for pagination.
            const itemCount = results.count.length;
            const pageCount = Math.ceil(results.count.length / req.query.limit);

            // return endpoint after passing validation.
            return res.render("dogtags/expiredTags", {
              title: "BWG | Expired Tags",
              message: messages,
              email: req.session.email,
              auth: req.session.auth, // authorization.
              ownerID: req.session.ownerID,
              data: results.rows,
              filterOptions: filterOptions,
              filterCategory: req.query.filterCategory,
              filterValue: req.query.filterValue,
              currentPage: req.query.page,
              pageCount,
              itemCount,
              queryCount: "Records returned: " + results.count.length,
              pages: paginate.getArrayPages(req)(5, pageCount, req.query.page),
              prev: paginate.href(req)(true),
              hasMorePages: paginate.hasNextPages(req)(pageCount),
            });
          })
          .catch((err) => {
            return res.render("dogtags/expiredTags", {
              title: "BWG | Dog Tags",
              message: "Page Error!",
              auth: req.session.auth, // authorization.
            });
          });
      }
    }
  }
);

/* GET /dogtags/dangerousDogs */
router.get(
  "/dangerousDogs",
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
      return res.render("dogtags/dangerousDogs", {
        title: "BWG | Dangerous Dogs",
        message: "Error!",
        email: req.session.email,
        auth: req.session.auth, // authorization.
      });
    } else {
      // check if there's an error message in the session
      let messages = req.session.messages || [];
      // clear session messages
      req.session.messages = [];

      // get dropdown values.
      var filterOptions = await Dropdown.findAll({
        where: {
          dropdownFormID: 29, // filtering options.
          dropdownTitle: "Dog Owner Filtering Options",
        },
      });

      // if there are no filter parameters.
      if (!req.query.filterCategory || !req.query.filterValue) {
        Owner.findAndCountAll({
          limit: req.query.limit,
          offset: req.skip,
          subQuery: false, // adding this gets rid of the 'unknown column' error caused when adding limit & offset.
          include: [
            {
              model: Address,
            },
            {
              model: Dog,
              where: {
                designation: {
                  [Op.like]: "Dangerous",
                },
              },
            },
          ],
          // group on first name because owners will appear more than once
          // depending on if they have more than 1 dog that is expired.
          group: ["Owner.ownerID"],
          order: [["ownerID", "ASC"]],
        })
          .then((results) => {
            // for pagination.
            const itemCount = results.count;
            const pageCount = Math.ceil(results.count.length / req.query.limit);

            // return endpoint after passing validation.
            return res.render("dogtags/dangerousDogs", {
              title: "BWG | Dangerous Dogs",
              message: messages,
              email: req.session.email,
              auth: req.session.auth, // authorization.
              ownerID: req.session.ownerID,
              data: results.rows,
              filterOptions: filterOptions,
              currentPage: req.query.page,
              pageCount,
              itemCount,
              queryCount: "Records returned: " + results.count.length,
              pages: paginate.getArrayPages(req)(5, pageCount, req.query.page),
              prev: paginate.href(req)(true),
              hasMorePages: paginate.hasNextPages(req)(pageCount),
            });
          })
          .catch((err) => {
            return res.render("dogtags/dangerousDogs", {
              title: "BWG | Dangerous Dogs",
              message: "Page Error!",
              auth: req.session.auth, // authorization.
            });
          });
      } else if (req.query.filterCategory === "Address") {
        Owner.findAndCountAll({
          limit: req.query.limit,
          offset: req.skip,
          subQuery: false, // adding this gets rid of the 'unknown column' error caused when adding limit & offset.
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
                designation: {
                  [Op.like]: "Dangerous",
                },
              },
            },
          ],
          // group on first name because owners will appear more than once
          // depending on if they have more than 1 dog that is expired.
          group: ["Owner.ownerID"],
          order: [["ownerID", "ASC"]],
        })
          .then((results) => {
            // for pagination.
            const itemCount = results.count.length;
            const pageCount = Math.ceil(results.count.length / req.query.limit);

            // return endpoint after passing validation.
            return res.render("dogtags/dangerousDogs", {
              title: "BWG | Dangerous Dogs",
              message: messages,
              email: req.session.email,
              auth: req.session.auth, // authorization.
              ownerID: req.session.ownerID,
              data: results.rows,
              filterOptions: filterOptions,
              filterCategory: req.query.filterCategory,
              filterValue: req.query.filterValue,
              currentPage: req.query.page,
              pageCount,
              itemCount,
              queryCount: "Records returned: " + results.count.length,
              pages: paginate.getArrayPages(req)(5, pageCount, req.query.page),
              prev: paginate.href(req)(true),
              hasMorePages: paginate.hasNextPages(req)(pageCount),
            });
          })
          .catch((err) => {
            return res.render("dogtags/dangerousDogs", {
              title: "BWG | Dangerous Dogs",
              message: "Page Error!",
              auth: req.session.auth, // authorization.
            });
          });
      } else if (req.query.filterCategory === "Dog Tag Number") {
        Owner.findAndCountAll({
          limit: req.query.limit,
          offset: req.skip,
          subQuery: false, // adding this gets rid of the 'unknown column' error caused when adding limit & offset.
          include: [
            {
              model: Address,
            },
            {
              model: Dog,
              where: {
                designation: {
                  [Op.like]: "Dangerous",
                },
                [Op.and]: {
                  tagNumber: req.query.filterValue,
                },
              },
            },
          ],
          // group on first name because owners will appear more than once
          // depending on if they have more than 1 dog that is expired.
          group: ["Owner.ownerID"],
          order: [["ownerID", "ASC"]],
        })
          .then((results) => {
            // for pagination.
            const itemCount = results.count.length;
            const pageCount = Math.ceil(results.count.length / req.query.limit);

            // return endpoint after passing validation.
            return res.render("dogtags/dangerousDogs", {
              title: "BWG | Dangerous Dogs",
              message: messages,
              email: req.session.email,
              auth: req.session.auth, // authorization.
              ownerID: req.session.ownerID,
              data: results.rows,
              filterOptions: filterOptions,
              filterCategory: req.query.filterCategory,
              filterValue: req.query.filterValue,
              currentPage: req.query.page,
              pageCount,
              itemCount,
              queryCount: "Records returned: " + results.count.length,
              pages: paginate.getArrayPages(req)(5, pageCount, req.query.page),
              prev: paginate.href(req)(true),
              hasMorePages: paginate.hasNextPages(req)(pageCount),
            });
          })
          .catch((err) => {
            return res.render("dogtags/dangerousDogs", {
              title: "BWG | Dangerous Dogs",
              message: "Page Error!",
              auth: req.session.auth, // authorization.
            });
          });
      } else if (req.query.filterCategory === "Additional Owner Name") {
        Owner.findAndCountAll({
          limit: req.query.limit,
          offset: req.skip,
          subQuery: false, // adding this gets rid of the 'unknown column' error caused when adding limit & offset.
          where: {
            [Op.or]: {
              "$AdditionalOwner.firstName$": {
                [Op.like]: "%" + req.query.filterValue + "%",
              },
              "$AdditionalOwner.lastName$": {
                [Op.like]: "%" + req.query.filterValue + "%",
              },
            },
          },
          include: [
            {
              model: AdditionalOwner,
              as: "AdditionalOwner",
            },
            {
              model: Address,
            },
            {
              model: Dog,
              where: {
                designation: {
                  [Op.like]: "Dangerous",
                },
              },
            },
          ],
          // group on first name because owners will appear more than once
          // depending on if they have more than 1 dog that is expired.
          group: "AdditionalOwner.ownerID",
          order: [["ownerID", "ASC"]],
        })
          .then((results) => {
            // for pagination.
            const itemCount = results.count.length;
            const pageCount = Math.ceil(results.count.length / req.query.limit);

            // return endpoint after passing validation.
            return res.render("dogtags/search/additionalOwnerSearch", {
              title: "BWG | Dog Tags",
              message: messages,
              email: req.session.email,
              auth: req.session.auth, // authorization.
              ownerID: req.session.ownerID,
              data: results.rows,
              filterOptions: filterOptions,
              filterCategory: req.query.filterCategory,
              filterValue: req.query.filterValue,
              currentPage: req.query.page,
              pageCount,
              itemCount,
              queryCount: "Records returned: " + results.count.length,
              pages: paginate.getArrayPages(req)(5, pageCount, req.query.page),
              prev: paginate.href(req)(true),
              hasMorePages: paginate.hasNextPages(req)(pageCount),
            });
          })
          .catch((err) => {
            return res.render("dogtags/dangerousDogs", {
              title: "BWG | Dangerous Dogs",
              message: "Page Error!",
              auth: req.session.auth, // authorization.
            });
          });
      } else if (req.query.filterCategory === "Owner Name") {
        // checks to see if input contains more than 1 word. i.e: "firstName + lastName"
        if (req.query.filterValue.trim().indexOf(" ") != -1) {
          Owner.findAndCountAll({
            limit: req.query.limit,
            offset: req.skip,
            subQuery: false, // adding this gets rid of the 'unknown column' error caused when adding limit & offset.
            where: Sequelize.where(
              Sequelize.fn(
                "concat",
                Sequelize.col("firstName"),
                " ", // have to include the whitespace between. i.e: JohnDoe != John Doe.
                Sequelize.col("lastName")
              ),
              {
                [Op.like]: "%" + req.query.filterValue + "%",
              }
            ),
            include: [
              {
                model: Address,
              },
              {
                model: Dog,
                where: {
                  designation: {
                    [Op.like]: "Dangerous",
                  },
                },
              },
            ],
            // group on first name because owners will appear more than once
            // depending on if they have more than 1 dog that is expired.
            group: ["Owner.ownerID"],
            order: [["ownerID", "ASC"]],
          })
            .then((results) => {
              // for pagination.
              const itemCount = results.count.length;
              const pageCount = Math.ceil(
                results.count.length / req.query.limit
              );

              return res.render("dogtags/dangerousDogs", {
                title: "BWG | Dangerous Dogs",
                message: messages,
                email: req.session.email,
                auth: req.session.auth, // authorization.
                data: results.rows,
                filterCategory: req.query.filterCategory,
                filterValue: req.query.filterValue,
                filterOptions: filterOptions,
                currentPage: req.query.page,
                pageCount,
                itemCount,
                queryCount: "Records returned: " + results.count.length,
                pages: paginate.getArrayPages(req)(
                  5,
                  pageCount,
                  req.query.page
                ),
                prev: paginate.href(req)(true),
                hasMorePages: paginate.hasNextPages(req)(pageCount),
              });
            })
            // catch any scary errors and render page error.
            .catch((err) => {
              return res.render("dogtags/dangerousDogs", {
                title: "BWG | Dangerous Dogs",
                message: "Page Error!",
                auth: req.session.auth, // authorization.
              });
            });
        } else {
          Owner.findAndCountAll({
            limit: req.query.limit,
            offset: req.skip,
            subQuery: false, // adding this gets rid of the 'unknown column' error caused when adding limit & offset.
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
            include: [
              {
                model: Address,
              },
              {
                model: Dog,
                where: {
                  designation: {
                    [Op.like]: "Dangerous",
                  },
                },
              },
            ],
            // group on first name because owners will appear more than once
            // depending on if they have more than 1 dog that is expired.
            group: ["Owner.ownerID"],
            order: [["ownerID", "ASC"]],
          })
            .then((results) => {
              // for pagination.
              const itemCount = results.count.length;
              const pageCount = Math.ceil(
                results.count.length / req.query.limit
              );

              return res.render("dogtags/dangerousDogs", {
                title: "BWG | Dangerous Dogs",
                message: messages,
                email: req.session.email,
                auth: req.session.auth, // authorization.
                data: results.rows,
                filterCategory: req.query.filterCategory,
                filterValue: req.query.filterValue,
                filterOptions: filterOptions,
                currentPage: req.query.page,
                pageCount,
                itemCount,
                queryCount: "Records returned: " + results.count.length,
                pages: paginate.getArrayPages(req)(
                  5,
                  pageCount,
                  req.query.page
                ),
                prev: paginate.href(req)(true),
                hasMorePages: paginate.hasNextPages(req)(pageCount),
              });
            })
            // catch any scary errors and render page error.
            .catch((err) => {
              return res.render("dogtags/expiredTags", {
                title: "BWG | Dangerous Dogs",
                message: "Page Error!",
                auth: req.session.auth, // authorization.
              });
            });
        }
      } else if (req.query.filterCategory === "Vendor") {
        Owner.findAndCountAll({
          limit: req.query.limit,
          offset: req.skip,
          subQuery: false, // adding this gets rid of the 'unknown column' error caused when adding limit & offset.
          where: {
            $vendor$: {
              [Op.like]: "%" + req.query.filterValue + "%",
            },
          },
          include: [
            {
              model: Dog,
              where: {
                designation: {
                  [Op.like]: "Dangerous",
                },
              },
            },
            {
              model: Address,
            },
          ],
          // group on first name because owners will appear more than once
          // depending on if they have more than 1 dog that is expired.
          group: ["Owner.ownerID"],
          order: [["ownerID", "ASC"]],
        })
          .then((results) => {
            // for pagination.
            const itemCount = results.count.length;
            const pageCount = Math.ceil(results.count.length / req.query.limit);

            return res.render("dogtags/dangerousDogs", {
              title: "BWG | Dangerous Dogs",
              email: req.session.email,
              auth: req.session.auth, // authorization.
              data: results.rows,
              filterCategory: req.query.filterCategory,
              filterValue: req.query.filterValue,
              filterOptions: filterOptions,
              currentPage: req.query.page,
              pageCount,
              itemCount,
              queryCount: "Records returned: " + results.count.length,
              pages: paginate.getArrayPages(req)(5, pageCount, req.query.page),
              prev: paginate.href(req)(true),
              hasMorePages: paginate.hasNextPages(req)(pageCount),
            });
          })
          // catch any scary errors and render page error.
          .catch((err) => {
            return res.render("dogtags/dangerousDogs", {
              title: "BWG | Dangerous Dogs",
              message: "Page Error!",
              auth: req.session.auth, // authorization.
            });
          });
      } else {
        // format filterCategory to match column name in db - via handy dandy camelize() function.
        var filterCategory = funcHelpers.camelize(req.query.filterCategory);

        Owner.findAndCountAll({
          limit: req.query.limit,
          offset: req.skip,
          subQuery: false, // adding this gets rid of the 'unknown column' error caused when adding limit & offset.
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
                designation: {
                  [Op.like]: "Dangerous",
                },
              },
            },
          ],
          // group on first name because owners will appear more than once
          // depending on if they have more than 1 dog that is expired.
          group: ["Owner.ownerID"],
          order: [["ownerID", "ASC"]],
        })
          .then((results) => {
            // for pagination.
            const itemCount = results.count.length;
            const pageCount = Math.ceil(results.count.length / req.query.limit);

            // return endpoint after passing validation.
            return res.render("dogtags/dangerousDogs", {
              title: "BWG | Dangerous Dogs",
              message: messages,
              email: req.session.email,
              auth: req.session.auth, // authorization.
              ownerID: req.session.ownerID,
              data: results.rows,
              filterOptions: filterOptions,
              filterCategory: req.query.filterCategory,
              filterValue: req.query.filterValue,
              currentPage: req.query.page,
              pageCount,
              itemCount,
              queryCount: "Records returned: " + results.count.length,
              pages: paginate.getArrayPages(req)(5, pageCount, req.query.page),
              prev: paginate.href(req)(true),
              hasMorePages: paginate.hasNextPages(req)(pageCount),
            });
          })
          .catch((err) => {
            return res.render("dogtags/dangerousDogs", {
              title: "BWG | Dangerous Dogs",
              message: "Page Error!",
              auth: req.session.auth, // authorization.
            });
          });
      }
    }
  }
);

/* GET /dogtags/printDog/:id */
router.get(
  "/printDog/:id",
  param("id").matches(/^\d+$/).trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("dogtags/printDog", {
        title: "BWG | Print Dog",
        message: "Error!",
        email: req.session.email,
        auth: req.session.auth, // authorization.
      });
    } else {
      // check if there's an error message in the session
      let messages = req.session.messages || [];
      // clear session messages
      req.session.messages = [];

      // get owner and dog info.
      Owner.findOne({
        include: [
          {
            model: Dog,
            where: {
              dogID: req.params.id,
            },
          },
          {
            model: Address,
          },
        ],
      })
        .then((results) => {
          // return endpoint after passing validation.
          return res.render("dogtags/printDog", {
            title: "BWG | Print Dog",
            layout: "",
            message: messages,
            email: req.session.email,
            auth: req.session.auth, // authorization.
            ownerID: req.session.ownerID,
            // data to populate form with.
            data: {
              tagNumber: results.dogs[0].tagNumber,
              issueDate: results.dogs[0].issueDate,
              designation: results.dogs[0].designation,
              dogName: results.dogs[0].dogName,
              breed: results.dogs[0].breed,
              colour: results.dogs[0].colour,
              gender: results.dogs[0].gender,
              spade: results.dogs[0].spade,
              rabiesTagNumber: results.dogs[0].rabiesTagNumber,
              rabiesExpiry: results.dogs[0].rabiesExpiry,
              vetOffice: results.dogs[0].vetOffice,
              firstName: results.firstName,
              lastName: results.lastName,
              email: results.email,
              streetNumber: results.addresses[0].streetNumber,
              streetName: results.addresses[0].streetName,
              town: results.addresses[0].town,
              poBoxAptRR: results.addresses[0].poBoxAptRR,
              postalCode: results.addresses[0].postalCode,
              homePhone: results.homePhone,
              cellPhone: results.cellPhone,
              workPhone: results.workPhone,
            },
          });
        })
        .catch((err) => {
          return res.render("dogtags/printDog", {
            title: "BWG | Print Dog",
            message: "Page Error!",
            auth: req.session.auth, // authorization.
          });
        });
    }
  }
);

module.exports = router;
