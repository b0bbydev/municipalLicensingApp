var express = require("express");
var router = express.Router();
// models.
var DonationBin = require("../../models/donationBin/donationBin");
var DonationBinPropertyOwner = require("../../models/donationBin/donationBinPropertyOwner");
var DonationBinPropertyOwnerAddress = require("../../models/donationBin/donationBinPropertyOwnerAddress");
// pagination lib.
const paginate = require("express-paginate");

/* GET /donationBin */
router.get("/", async (req, res, next) => {
  // check if there's an error message in the session
  let messages = req.session.messages || [];
  // clear session messages
  req.session.messages = [];

  DonationBinPropertyOwner.findAndCountAll({
    limit: req.query.limit,
    offset: req.skip,
    include: [
      {
        model: DonationBinPropertyOwnerAddress,
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
