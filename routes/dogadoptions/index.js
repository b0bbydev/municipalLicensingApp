var express = require("express");
var router = express.Router();
// models.
const Adopter = require("../../models/dogAdoptions/adopter");
const AdopterAddress = require("../../models/dogAdoptions/adopterAddress");
const AdoptedDog = require("../../models/dogAdoptions/adoptedDog");
const Dropdown = require("../../models/dropdownManager/dropdown");
// helper.
const funcHelpers = require("../../config/funcHelpers");
// sequelize.
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
// pagination lib.
const paginate = require("express-paginate");
// express-validate.
const { body, validationResult } = require("express-validator");

/* GET /dogAdoptions */
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
      return res.render("dogAdoptions/index", {
        title: "BWG | Dog Adoptions",
        message: "Page Error!",
        auth: req.session.auth, // authorization.
      });
    } else {
      // check if there's an error message in the session
      let messages = req.session.messages || [];
      // clear session messages
      req.session.messages = [];

      // get filtering options.
      var filterOptions = await Dropdown.findAll({
        where: {
          dropdownFormID: 29, // filtering options.
          dropdownTitle: "Dog Adopter Filtering Options",
        },
      });

      // get adoptedDogs.
      var adoptedDogs = await AdoptedDog.findAll({});

      // if there are no filter parameters.
      if (!req.query.filterCategory || !req.query.filterValue) {
        // get all owners & addresses.
        Adopter.findAndCountAll({
          limit: req.query.limit,
          offset: req.skip,
          order: [["adopterID", "DESC"]],
          include: [
            {
              model: AdopterAddress,
              as: "addresses",
            },
          ],
        }).then((results) => {
          // for pagination.
          const itemCount = results.count;
          const pageCount = Math.ceil(results.count / req.query.limit);

          return res.render("dogAdoptions/index", {
            title: "BWG | Dog Adoptions",
            message: messages,
            email: req.session.email,
            auth: req.session.auth, // authorization.
            data: results.rows,
            filterOptions: filterOptions,
            adoptedDogs: adoptedDogs,
            currentPage: req.query.page,
            pageCount,
            itemCount,
            queryCount: "Records returned: " + results.count,
            pages: paginate.getArrayPages(req)(5, pageCount, req.query.page),
            prev: paginate.href(req)(true),
            hasMorePages: paginate.hasNextPages(req)(pageCount),
          });
        });
        // Adopter Name
      } else if (req.query.filterCategory === "Adopter Name") {
        // checks to see if input contains more than 1 word. i.e: "firstName + lastName"
        if (req.query.filterValue.trim().indexOf(" ") != -1) {
          Adopter.findAndCountAll({
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
                model: AdopterAddress,
                as: "addresses",
              },
            ],
          })
            .then((results) => {
              // for pagination.
              const itemCount = results.count;
              const pageCount = Math.ceil(results.count / req.query.limit);

              return res.render("dogAdoptions/index", {
                title: "BWG | Dog Adoptions",
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
              return res.render("dogAdoptions/index", {
                title: "BWG | Dog Adoptions",
                message: "Page Error!",
                auth: req.session.auth, // authorization.
              });
            });
        } else {
          Adopter.findAndCountAll({
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
                model: AdopterAddress,
                as: "addresses",
              },
            ],
          })
            .then((results) => {
              // for pagination.
              const itemCount = results.count;
              const pageCount = Math.ceil(results.count / req.query.limit);

              return res.render("dogAdoptions/index", {
                title: "BWG | Dog Adoptions",
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
              return res.render("dogAdoptions/index", {
                title: "BWG | Dog Adoptions",
                message: "Page Error!",
                auth: req.session.auth, // authorization.
              });
            });
        }
      } else if (req.query.filterCategory === "Address") {
        Adopter.findAndCountAll({
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
              model: AdopterAddress,
              as: "addresses",
            },
          ],
        })
          .then((results) => {
            // for pagination.
            const itemCount = results.count;
            const pageCount = Math.ceil(results.count / req.query.limit);

            return res.render("dogAdoptions/index", {
              title: "BWG | Dog Adoptions",
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
            return res.render("dogAdoptions/index", {
              title: "BWG | Dog Adoptions",
              message: "Page Error!",
              auth: req.session.auth, // authorization.
            });
          });
      } else {
        // format filterCategory to match column name in db - via handy dandy camelize() function.
        var filterCategory = funcHelpers.camelize(req.query.filterCategory);

        // create filter query.
        Adopter.findAndCountAll({
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
              model: AdopterAddress,
              as: "addresses",
            },
          ],
        })
          .then((results) => {
            // for pagination.
            const itemCount = results.count;
            const pageCount = Math.ceil(results.count / req.query.limit);

            return res.render("dogAdoptions/index", {
              title: "BWG | Dog Adoptions",
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
            return res.render("dogAdoptions/index", {
              title: "BWG | Dog Adoptions",
              message: "Page Error!",
              auth: req.session.auth, // authorization.
            });
          });
      }
    }
  }
);

/* POST /dogAdoptions */
router.post(
  "/",
  body("dogName")
    .if(body("dogName").notEmpty())
    .matches(/^[^%<>^$\\;!{}?]+$/)
    .withMessage("Invalid Dog Name Entry!")
    .trim(),
  body("adopterName")
    .if(body("adopterName").notEmpty())
    .matches(/^[^%<>^$\\;!{}?]+$/)
    .withMessage("Invalid Adopter Name Entry!")
    .trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // use built-in array() to convert Result object to array for custom error messages.
    var errorArray = errors.array();

    // if errors is NOT empty (if there are errors...).
    if (!errors.isEmpty()) {
      return res.render("dogAdoptions/index", {
        title: "BWG | Dog Adoptions",
        message: errorArray[0].msg, // custom error message. (should indicate which field has the error.)
        email: req.session.email,
        auth: req.session.auth, // authorization.
        // if the form submission is unsuccessful, save their values.
        formData: {
          dogName: req.body.dogName,
          adopterName: req.body.adopterName,
        },
      });
    } else {
      AdoptedDog.update(
        {
          adopterAdopterID: req.body.adopterID,
        },
        {
          where: {
            adoptedDogID: req.body.selection,
          },
        }
      )
        .then(() => {
          return res.redirect("/dogAdoptions");
        })
        .catch((err) => {
          return res.render("dogAdoptions/index", {
            title: "BWG | Dog Adoptions",
            message: "Page Error!",
            auth: req.session.auth, // authorization.
          });
        });
    }
  }
);

module.exports = router;
