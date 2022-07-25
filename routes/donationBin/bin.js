var express = require("express");
var router = express.Router();
// models.
var DonationBinPropertyOwner = require("../../models/donationBin/donationBinPropertyOwner");
var DonationBinPropertyOwnerAddress = require("../../models/donationBin/donationBinPropertyOwnerAddress");
const DonationBinOperator = require("../../models/donationBin/donationBinOperator");
const DonationBinOperatorAddress = require("../../models/donationBin/donationBinOperatorAddress");
// pagination lib.
const paginate = require("express-paginate");

/* GET /donationBin/bin/:id */
router.get("/:id", async (req, res, next) => {
  // check if there's an error message in the session
  let messages = req.session.messages || [];
  // clear session messages
  req.session.messages = [];

  // send donationBinID to session.
  req.session.donationBinID = req.params.id;

  DonationBinPropertyOwner.findAndCountAll({
    limit: req.query.limit,
    offset: req.skip,
    include: [
      {
        model: DonationBinPropertyOwnerAddress,
      },
    ],
  }).then((propertyOwners) => {
    // for pagination.
    const itemCount = propertyOwners.count;
    const pageCount = Math.ceil(propertyOwners.count / req.query.limit);

    return res.render("donationBin/bin", {
      title: "BWG | Donation Bin",
      errorMessages: messages,
      email: req.session.email,
      auth: req.session.auth, // authorization.
      propertyOwners: propertyOwners.rows,
      pageCount,
      itemCount,
      queryCount: "Records returned: " + propertyOwners.count,
      pages: paginate.getArrayPages(req)(5, pageCount, req.query.page),
      prev: paginate.href(req)(true),
      hasMorePages: paginate.hasNextPages(req)(pageCount),
    });
  });
});

module.exports = router;
