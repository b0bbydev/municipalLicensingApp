var express = require("express");
var router = express.Router();
// models.
var DonationBinOperator = require("../../models/donationBin/donationBinOperator");
// pagination lib.
const paginate = require("express-paginate");

/* GET /donationBin/operators/:id */
router.get("/:id", async (req, res, next) => {
  // check if there's an error message in the session
  let messages = req.session.messages || [];
  // clear session messages
  req.session.messages = [];

  // send charityID to session.
  req.session.donationBinPropertyOwnerID = req.params.id;

  DonationBinOperator.findAndCountAll({
    limit: req.query.limit,
    offset: req.skip,
    where: {
      donationBinPropertyOwnerID: req.session.donationBinPropertyOwnerID,
    },
  }).then((results) => {
    // for pagination.
    const itemCount = results.count;
    const pageCount = Math.ceil(results.count / req.query.limit);

    return res.render("donationBin/operators", {
      title: "BWG | Donation Bin Operators",
      errorMessages: messages,
      email: req.session.email,
      auth: req.session.auth, // authorization.
      data: results.rows,
      pageCount,
      itemCount,
      queryCount: "Records returned: " + results.count,
      pages: paginate.getArrayPages(req)(5, pageCount, req.query.page),
      prev: paginate.href(req)(true),
      hasMorePages: paginate.hasNextPages(req)(pageCount),
    });
  });
});

module.exports = router;
