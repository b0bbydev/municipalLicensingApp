var express = require("express");
var router = express.Router();
// models.
const Adopter = require("../../models/dogAdoptions/adopter");
const AdopterAddress = require("../../models/dogAdoptions/adopterAddress");
const AdoptedDog = require("../../models/dogAdoptions/adoptedDog");
const Dropdown = require("../../models/dropdownManager/dropdown");
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
