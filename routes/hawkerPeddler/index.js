var express = require("express");
var router = express.Router();
// models.
const Dropdown = require("../../models/dropdownManager/dropdown");
const HawkerPeddlerBusiness = require("../../models/hawkerPeddler/hawkerPeddlerBusiness");
const HawkerPeddlerBusinessAddress = require("../../models/hawkerPeddler/hawkerPeddlerBusinessAddress");
const HawkerPeddlerApplicant = require("../../models/hawkerPeddler/hawkerPeddlerApplicant");
const HawkerPeddlerApplicantAddress = require("../../models/hawkerPeddler/hawkerPeddlerApplicantAddress");
// sequelize.
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
// pagination lib.
const paginate = require("express-paginate");
// express-validate.
const { body, param, validationResult } = require("express-validator");

/* GET /hawkerPeddler */
router.get("/", async (req, res, next) => {
  // check if there's an error message in the session
  let messages = req.session.messages || [];
  // clear session messages
  req.session.messages = [];

  // get filtering options.
  var filterOptions = await Dropdown.findAll({
    where: {
      dropdownFormID: 29, // filtering options.
      dropdownTitle: "Hawker & Peddler Filtering Options",
    },
  });

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

  // if there are no filter parameters.
  if (!req.query.filterCategory || !req.query.filterValue) {
    HawkerPeddlerBusiness.findAndCountAll({
      limit: req.query.limit,
      offset: req.skip,
      include: [
        {
          model: HawkerPeddlerBusinessAddress,
        },
      ],
    })
      .then((results) => {
        // for pagination.
        const itemCount = results.count;
        const pageCount = Math.ceil(results.count / req.query.limit);

        return res.render("hawkerPeddler/index", {
          title: "BWG | Hawker & Peddler Licensing",
          message: messages,
          email: req.session.email,
          auth: req.session.auth, // authorization.
          data: results.rows,
          filterOptions: filterOptions,
          modalExpiryDate: modalExpiryDate,
          pageCount,
          itemCount,
          queryCount: "Records returned: " + results.count,
          pages: paginate.getArrayPages(req)(5, pageCount, req.query.page),
          prev: paginate.href(req)(true),
          hasMorePages: paginate.hasNextPages(req)(pageCount),
        });
      })
      .catch((err) => {
        return res.render("hawkerPeddler/index", {
          title: "BWG | Hawker & Peddler Licensing",
          message: "Page Error!",
        });
      });
  } else if (req.query.filterCategory === "Business Name") {
    HawkerPeddlerBusiness.findAndCountAll({
      limit: req.query.limit,
      offset: req.skip,
      where: {
        businessName: {
          [Op.like]: "%" + req.query.filterValue + "%",
        },
      },
      include: [
        {
          model: HawkerPeddlerBusinessAddress,
        },
      ],
    })
      .then((results) => {
        // for pagination.
        const itemCount = results.count;
        const pageCount = Math.ceil(results.count / req.query.limit);

        return res.render("hawkerPeddler/index", {
          title: "BWG | Hawker & Peddler Licensing",
          message: messages,
          email: req.session.email,
          auth: req.session.auth, // authorization.
          data: results.rows,
          filterCategory: req.query.filterCategory,
          filterValue: req.query.filterValue,
          filterOptions: filterOptions,
          modalExpiryDate: modalExpiryDate,
          pageCount,
          itemCount,
          queryCount: "Records returned: " + results.count,
          pages: paginate.getArrayPages(req)(5, pageCount, req.query.page),
          prev: paginate.href(req)(true),
          hasMorePages: paginate.hasNextPages(req)(pageCount),
        });
      })
      .catch((err) => {
        return res.render("hawkerPeddler/index", {
          title: "BWG | Hawker & Peddler Licensing",
          message: "Page Error!",
        });
      });
  } else if (req.query.filterCategory === "Applicant Name") {
    // checks to see if input contains more than 1 word. i.e: "firstName + lastName"
    if (req.query.filterValue.trim().indexOf(" ") != -1) {
      HawkerPeddlerApplicant.findAndCountAll({
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
            model: HawkerPeddlerApplicantAddress,
          },
        ],
      })
        .then((results) => {
          // for pagination.
          const itemCount = results.count;
          const pageCount = Math.ceil(results.count / req.query.limit);

          return res.render("hawkerPeddler/search/applicantSearch", {
            title: "BWG | Hawker & Peddler Licensing",
            message: messages,
            email: req.session.email,
            auth: req.session.auth, // authorization.
            data: results.rows,
            filterCategory: req.query.filterCategory,
            filterValue: req.query.filterValue,
            filterOptions: filterOptions,
            modalExpiryDate: modalExpiryDate,
            pageCount,
            itemCount,
            queryCount: "Records returned: " + results.count,
            pages: paginate.getArrayPages(req)(5, pageCount, req.query.page),
            prev: paginate.href(req)(true),
            hasMorePages: paginate.hasNextPages(req)(pageCount),
          });
        })
        .catch((err) => {
          return res.render("hawkerPeddler/search/applicantSearch", {
            title: "BWG | Hawker & Peddler Licensing",
            message: "Page Error!",
          });
        });
    } else {
      HawkerPeddlerApplicant.findAndCountAll({
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
            model: HawkerPeddlerApplicantAddress,
          },
        ],
      })
        .then((results) => {
          // for pagination.
          const itemCount = results.count;
          const pageCount = Math.ceil(results.count / req.query.limit);

          return res.render("hawkerPeddler/search/applicantSearch", {
            title: "BWG | Hawker & Peddler Licensing",
            message: messages,
            email: req.session.email,
            auth: req.session.auth, // authorization.
            data: results.rows,
            filterCategory: req.query.filterCategory,
            filterValue: req.query.filterValue,
            filterOptions: filterOptions,
            modalExpiryDate: modalExpiryDate,
            pageCount,
            itemCount,
            queryCount: "Records returned: " + results.count,
            pages: paginate.getArrayPages(req)(5, pageCount, req.query.page),
            prev: paginate.href(req)(true),
            hasMorePages: paginate.hasNextPages(req)(pageCount),
          });
        })
        .catch((err) => {
          return res.render("hawkerPeddler/search/applicantSearch", {
            title: "BWG | Hawker & Peddler Licensing",
            message: "Page Error!",
          });
        });
    }
  } else if (req.query.filterCategory === "Applicant Address") {
    HawkerPeddlerApplicant.findAndCountAll({
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
          model: HawkerPeddlerApplicantAddress,
        },
      ],
    })
      .then((results) => {
        // for pagination.
        const itemCount = results.count;
        const pageCount = Math.ceil(results.count / req.query.limit);

        return res.render("hawkerPeddler/search/applicantSearch", {
          title: "BWG | Hawker & Peddler Licensing",
          message: messages,
          email: req.session.email,
          auth: req.session.auth, // authorization.
          data: results.rows,
          filterCategory: req.query.filterCategory,
          filterValue: req.query.filterValue,
          filterOptions: filterOptions,
          modalExpiryDate: modalExpiryDate,
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
        return res.render("hawkerPeddler/search/applicantSearch", {
          title: "BWG | Hawker & Peddler Licensing",
          message: "Page Error!",
        });
      });
  }
});

/* POST /hawkerPeddler - renews license. */
router.post("/", async (req, res, next) => {
  // server side validation.
  const errors = validationResult(req);

  // if errors is NOT empty (if there are errors...).
  if (!errors.isEmpty()) {
    return res.render("hawkerPeddler/index", {
      title: "BWG | Hawker & Peddler Licensing",
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

    // update license.
    HawkerPeddlerBusiness.update(
      {
        issueDate: issueDate,
        expiryDate: expiryDate,
      },
      {
        where: {
          hawkerPeddlerBusinessID: req.body.hawkerPeddlerBusinessID,
        },
      }
    )
      .then(() => {
        return res.redirect("/hawkerPeddler");
      })
      // catch any scary errors and render page error.
      .catch((err) => {
        return res.render("hawkerPeddler/index", {
          title: "BWG | Hawker & Peddler Licensing",
          message: "Page Error!",
        });
      });
  }
});

/* POST /hawkerPeddler/history - getting value to search by, then redirect */
router.post(
  "/history",
  body("businessName")
    .if(body("businessName").notEmpty())
    .matches(/^[^%<>^$\/\\;!{}?]+$/)
    .withMessage("Invalid Business Name Entry!")
    .trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...).
    if (!errors.isEmpty()) {
      return res.render("hawkerPeddler/index", {
        title: "BWG | Hawker & Peddler Licensing",
        message: "Page Error!",
        email: req.session.email,
        auth: req.session.auth, // authorization.
      });
    } else {
      // get the specified business.
      HawkerPeddlerBusiness.findOne({
        where: {
          businessName: req.body.businessName,
        },
      })
        .then((results) => {
          // redirect to unique history page.
          return res.redirect(
            "/hawkerPeddler/businessAddressHistory/" +
              results.hawkerPeddlerBusinessID
          );
        })
        // catch any scary errors and render page error.
        .catch((err) => {
          return res.render("hawkerPeddler/index", {
            title: "BWG | Hawker & Peddler Licensing",
            message: "Page Error!",
          });
        });
    }
  }
);

/* GET /hawkerPeddler/printLicense/:id */
router.get(
  "/printLicense/:id",
  param("id").matches(/^\d+$/).trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("hawkerPeddler/printLicense", {
        title: "BWG | Print License",
        message: "Error!",
        email: req.session.email,
        auth: req.session.auth, // authorization.
      });
    } else {
      // check if there's an error message in the session
      let messages = req.session.messages || [];
      // clear session messages
      req.session.messages = [];

      // get info.
      HawkerPeddlerBusiness.findOne({
        where: {
          hawkerPeddlerBusinessID: req.params.id,
        },
        include: [
          {
            model: HawkerPeddlerBusinessAddress,
          },
          {
            model: HawkerPeddlerApplicant,
          },
        ],
      })
        .then((results) => {
          // return endpoint after passing validation.
          return res.render("hawkerPeddler/printLicense", {
            title: "BWG | Print License",
            layout: "",
            message: messages,
            email: req.session.email,
            auth: req.session.auth, // authorization.
            // data to populate form with.
            data: {
              applicantName:
                results.hawkerPeddlerApplicants[0].firstName +
                " " +
                results.hawkerPeddlerApplicants[0].lastName,
              businessName: results.businessName,
              streetNumber:
                results.hawkerPeddlerBusinessAddresses[0].streetNumber,
              streetName: results.hawkerPeddlerBusinessAddresses[0].streetName,
              town: results.hawkerPeddlerBusinessAddresses[0].town,
              issueDate: results.issueDate,
              expiryDate: results.expiryDate,
              licenseNumber: results.hawkerPeddlerApplicants[0].licenseNumber,
            },
          });
        })
        // catch any scary errors and render page error.
        .catch((err) => {
          return res.render("hawkerPeddler/printLicense", {
            title: "BWG | Print License",
            message: "Page Error!",
          });
        });
    }
  }
);

module.exports = router;
