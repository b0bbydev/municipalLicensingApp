var express = require("express");
var router = express.Router();
// models.
const Dropdown = require("../../models/dropdownManager/dropdown");
const DonationBin = require("../../models/donationBin/donationBin");
const DonationBinAddress = require("../../models/donationBin/donationBinAddress");
const DonationBinOperator = require("../../models/donationBin/donationBinOperator");
const DonationBinOperatorAddress = require("../../models/donationBin/donationBinOperatorAddress");
const DonationBinCharity = require("../../models/donationBin/donationBinCharity");
// sequelize.
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
// express-validate.
const { body, validationResult } = require("express-validator");
// pagination lib.
const paginate = require("express-paginate");

/* GET /donationBin */
router.get("/", async (req, res, next) => {
  // check if there's an error message in the session
  let messages = req.session.messages || [];
  // clear session messages
  req.session.messages = [];

  // get dropdown values.
  var dropdownValues = await Dropdown.findAll({
    where: {
      dropdownFormID: 22,
    },
  });

  // if there are no filter parameters.
  if (!req.query.filterCategory || !req.query.filterValue) {
    DonationBin.findAndCountAll({
      limit: req.query.limit,
      offset: req.skip,
      include: [
        {
          model: DonationBinAddress,
        },
      ],
    }).then((results) => {
      // for pagination.
      const itemCount = results.count;
      const pageCount = Math.ceil(results.count / req.query.limit);

      return res.render("donationBin/index", {
        title: "BWG | Donation Bin Licenses",
        errorMessages: messages,
        email: req.session.email,
        auth: req.session.auth, // authorization.
        data: results.rows,
        dropdownValues: dropdownValues,
        pageCount,
        itemCount,
        queryCount: "Records returned: " + results.count,
        pages: paginate.getArrayPages(req)(5, pageCount, req.query.page),
        prev: paginate.href(req)(true),
        hasMorePages: paginate.hasNextPages(req)(pageCount),
      });
    });
  } else if (req.query.filterCategory === "Address") {
    DonationBin.findAndCountAll({
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
          model: DonationBinAddress,
        },
      ],
    })
      .then((results) => {
        // for pagination.
        const itemCount = results.count;
        const pageCount = Math.ceil(results.count / req.query.limit);

        return res.render("donationBin/index", {
          title: "BWG | Donation Bin Licenses",
          errorMessages: messages,
          email: req.session.email,
          auth: req.session.auth, // authorization.
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
      })
      // catch any scary errors and render page error.
      .catch((err) =>
        res.render("donationBin/index", {
          title: "BWG | Donation Bin Licenses",
          message: "Page Error!",
        })
      );
  } else if (req.query.filterCategory === "Bin Operator Name") {
    // checks to see if input contains more than 1 word. i.e: "firstName + lastName"
    if (req.query.filterValue.trim().indexOf(" ") != -1) {
      DonationBinOperator.findAndCountAll({
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
            model: DonationBinOperatorAddress,
          },
        ],
      }).then((results) => {
        // for pagination.
        const itemCount = results.count;
        const pageCount = Math.ceil(results.count / req.query.limit);

        return res.render("donationBin/search/donationBinOperatorSearch", {
          title: "BWG | Donation Bin Licenses",
          errorMessages: messages,
          email: req.session.email,
          auth: req.session.auth, // authorization.
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
      DonationBinOperator.findAndCountAll({
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
            model: DonationBinOperatorAddress,
          },
        ],
      }).then((results) => {
        // for pagination.
        const itemCount = results.count;
        const pageCount = Math.ceil(results.count / req.query.limit);

        return res.render("donationBin/search/donationBinOperatorSearch", {
          title: "BWG | Donation Bin Licenses",
          errorMessages: messages,
          email: req.session.email,
          auth: req.session.auth, // authorization.
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
    }
  } else if (req.query.filterCategory === "Charity/Organization") {
    DonationBinCharity.findAndCountAll({
      limit: req.query.limit,
      offset: req.skip,
      where: {
        charityName: {
          [Op.like]: "%" + req.query.filterValue + "%",
        },
      },
    }).then((results) => {
      // for pagination.
      const itemCount = results.count;
      const pageCount = Math.ceil(results.count / req.query.limit);

      return res.render("donationBin/search/donationBinCharitySearch", {
        title: "BWG | Donation Bin Licenses",
        errorMessages: messages,
        email: req.session.email,
        auth: req.session.auth, // authorization.
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
  }
});

/* POST /donationBin - renews license. */
router.post("/", async (req, res, next) => {
  // server side validation.
  const errors = validationResult(req);

  // if errors is NOT empty (if there are errors...).
  if (!errors.isEmpty()) {
    return res.render("donationBin/index", {
      title: "BWG | Donation Bin Licenses",
      errorMessages: "Page Error!",
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
    DonationBin.update(
      {
        issueDate: issueDate,
        expiryDate: expiryDate,
      },
      {
        where: {
          donationBinID: req.body.donationBinID,
        },
      }
    ).then(() => {
      return res.redirect("/donationBin");
    });
  }
});

module.exports = router;
