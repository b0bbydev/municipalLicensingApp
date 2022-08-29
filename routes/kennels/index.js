var express = require("express");
var router = express.Router();
// models.
const Dropdown = require("../../models/dropdownManager/dropdown");
const Kennel = require("../../models/kennel/kennel");
const KennelAddress = require("../../models/kennel/kennelAddress");
const KennelOwner = require("../../models/kennel/kennelOwner");
const KennelOwnerAddress = require("../../models/kennel/kennelOwnerAddress");
// sequelize.
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
// helper.
const funcHelpers = require("../../config/funcHelpers");
// pagination lib.
const paginate = require("express-paginate");
// express-validate.
const { body, param, validationResult } = require("express-validator");

/* GET /kennels page. */
router.get("/", async (req, res, next) => {
  // check if there's an error message in the session
  let messages = req.session.messages || [];
  // clear session messages
  req.session.messages = [];

  // get filtering options.
  var filterOptions = await Dropdown.findAll({
    where: {
      dropdownFormID: 29, // filtering options.
      dropdownTitle: "Kennel Filtering Options",
    },
  });

  // get current date.
  var issueDate = new Date();
  // init expiryDate.
  var modalExpiryDate = new Date();

  // if issueDate is in November or December.
  if (issueDate.getMonth() === 10 || issueDate.getMonth() === 11) {
    modalExpiryDate = new Date(issueDate.getFullYear() + 2, 5, 30);
  } else {
    modalExpiryDate = new Date(issueDate.getFullYear() + 1, 5, 30); // year, month (june = 5), day
  }

  // if there are no filter parameters.
  if (!req.query.filterCategory || !req.query.filterValue) {
    Kennel.findAndCountAll({
      limit: req.query.limit,
      offset: req.skip,
      include: [
        {
          model: KennelAddress,
        },
      ],
    })
      .then((results) => {
        // for pagination.
        const itemCount = results.count;
        const pageCount = Math.ceil(results.count / req.query.limit);

        return res.render("kennels/index", {
          title: "BWG | Kennel Licensing",
          message: messages,
          email: req.session.email,
          auth: req.session.auth, // authorization.
          data: results.rows,
          filterOptions: filterOptions,
          modalExpiryDate: modalExpiryDate,
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
        return res.render("kennels/index", {
          title: "BWG | Kennel Licensing",
          message: "Page Error!" + err,
        });
      });
  } else if (req.query.filterCategory === "Kennel Name") {
    Kennel.findAndCountAll({
      limit: req.query.limit,
      offset: req.skip,
      where: {
        kennelName: {
          [Op.like]: "%" + req.query.filterValue + "%",
        },
      },
      include: [
        {
          model: KennelAddress,
        },
      ],
    })
      .then((results) => {
        // for pagination.
        const itemCount = results.count;
        const pageCount = Math.ceil(results.count / req.query.limit);

        return res.render("kennels/index", {
          title: "BWG | Kennel Licensing",
          message: messages,
          email: req.session.email,
          auth: req.session.auth, // authorization.
          data: results.rows,
          filterOptions: filterOptions,
          modalExpiryDate: modalExpiryDate,
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
        return res.render("kennels/index", {
          title: "BWG | Kennel Licensing",
          message: "Page Error!",
          auth: req.session.auth, // authorization.
        });
      });
  } else if (req.query.filterCategory === "Kennel Address") {
    Kennel.findAndCountAll({
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
          model: KennelAddress,
        },
      ],
    })
      .then((results) => {
        // for pagination.
        const itemCount = results.count;
        const pageCount = Math.ceil(results.count / req.query.limit);

        return res.render("kennels/index", {
          title: "BWG | Kennel Licensing",
          message: messages,
          email: req.session.email,
          auth: req.session.auth, // authorization.
          data: results.rows,
          filterCategory: req.query.filterCategory,
          filterValue: req.query.filterValue,
          filterOptions: filterOptions,
          modalExpiryDate: modalExpiryDate,
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
        return res.render("kennels/index", {
          title: "BWG | Kennel Licensing",
          message: "Page Error!",
          auth: req.session.auth, // authorization.
        });
      });
  } else if (req.query.filterCategory === "Kennel Owner Name") {
    // checks to see if input contains more than 1 word. i.e: "firstName + lastName"
    if (req.query.filterValue.trim().indexOf(" ") != -1) {
      KennelOwner.findAndCountAll({
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
            model: KennelOwnerAddress,
          },
        ],
      })
        .then((results) => {
          // for pagination.
          const itemCount = results.count;
          const pageCount = Math.ceil(results.count / req.query.limit);

          return res.render("kennels/search/kennelOwnerSearch", {
            title: "BWG | Kennel Licensing",
            message: messages,
            email: req.session.email,
            auth: req.session.auth, // authorization.
            data: results.rows,
            filterCategory: req.query.filterCategory,
            filterValue: req.query.filterValue,
            filterOptions: filterOptions,
            modalExpiryDate: modalExpiryDate,
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
          return res.render("kennels/search/kennelOwnerSearch", {
            title: "BWG | Kennel Licensing",
            message: "Page Error!",
            auth: req.session.auth, // authorization.
          });
        });
    } else {
      KennelOwner.findAndCountAll({
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
            model: KennelOwnerAddress,
          },
        ],
      })
        .then((results) => {
          // for pagination.
          const itemCount = results.count;
          const pageCount = Math.ceil(results.count / req.query.limit);

          return res.render("kennels/search/kennelOwnerSearch", {
            title: "BWG | Kennel Licensing",
            message: messages,
            email: req.session.email,
            auth: req.session.auth, // authorization.
            data: results.rows,
            filterCategory: req.query.filterCategory,
            filterValue: req.query.filterValue,
            filterOptions: filterOptions,
            modalExpiryDate: modalExpiryDate,
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
          return res.render("kennels/search/kennelOwnerSearch", {
            title: "BWG | Kennel Licensing",
            message: "Page Error!",
            auth: req.session.auth, // authorization.
          });
        });
    }
  } else {
    // format filterCategory to match column name in db - via handy dandy camelize() function.
    var filterCategory = funcHelpers.camelize(req.query.filterCategory);

    // create filter query.
    Kennel.findAndCountAll({
      limit: req.query.limit,
      offset: req.skip,
      where: {
        [filterCategory]: {
          [Op.like]: req.query.filterValue + "%",
        },
      },
      include: [
        {
          model: KennelAddress,
        },
      ],
    })
      .then((results) => {
        // for pagination.
        const itemCount = results.count;
        const pageCount = Math.ceil(results.count / req.query.limit);

        return res.render("kennels/index", {
          title: "BWG | Kennel Licensing",
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
        return res.render("kennels/index", {
          title: "BWG | Kennel Licensing",
          message: "Page Error!",
          auth: req.session.auth, // authorization.
        });
      });
  }
});

/* POST /kennels - renews license. */
router.post("/", async (req, res, next) => {
  // server side validation.
  const errors = validationResult(req);

  // if errors is NOT empty (if there are errors...).
  if (!errors.isEmpty()) {
    return res.render("kennels/index", {
      title: "BWG | Kennel Licensing",
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
      expiryDate = new Date(issueDate.getFullYear() + 2, 5, 30);
    } else {
      expiryDate = new Date(issueDate.getFullYear() + 1, 5, 30); // year, month (june = 5), day
    }

    // update license.
    Kennel.update(
      {
        issueDate: issueDate,
        expiryDate: expiryDate,
        licenseNumber: req.body.licenseNumber,
      },
      {
        where: {
          kennelID: req.body.kennelID,
        },
      }
    )
      .then(() => {
        return res.redirect("/kennels");
      })
      // catch any scary errors and render page error.
      .catch((err) => {
        return res.render("kennels/index", {
          title: "BWG | Kennel Licensing",
          message: "Page Error!",
          auth: req.session.auth, // authorization.
        });
      });
  }
});

/* GET /kennels/printLicense/:id */
router.get(
  "/printLicense/:id",
  param("id").matches(/^\d+$/).trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("kennels/printLicense", {
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
      Kennel.findOne({
        where: {
          kennelID: req.params.id,
        },
        include: [
          {
            model: KennelAddress,
          },
          {
            model: KennelOwner,
          },
        ],
      })
        .then((results) => {
          // return endpoint after passing validation.
          return res.render("kennels/printLicense", {
            title: "BWG | Print License",
            layout: "",
            message: messages,
            email: req.session.email,
            auth: req.session.auth, // authorization.
            // data to populate form with.
            data: {
              kennelOwnerName:
                results.kennelowners[0].firstName +
                " " +
                results.kennelowners[0].lastName,
              kennelName: results.kennelName,
              streetNumber: results.kennelAddresses[0].streetNumber,
              streetName: results.kennelAddresses[0].streetName,
              town: results.kennelAddresses[0].town,
              issueDate: results.issueDate,
              expiryDate: results.expiryDate,
              licenseNumber: results.licenseNumber,
            },
          });
        })
        // catch any scary errors and render page error.
        .catch((err) => {
          return res.render("kennels/printLicense", {
            title: "BWG | Print License",
            message: "Page Error!",
            auth: req.session.auth, // authorization.
          });
        });
    }
  }
);

module.exports = router;
