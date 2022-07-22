var express = require("express");
var router = express.Router();
// models.
const DonationBin = require("../../models/donationBin/donationBin");
// pagination lib.
const paginate = require("express-paginate");

/* GET /donationBin/bins/:id */
router.get("/:id", async (req, res, next) => {
  // check if there's an error message in the session
  let messages = req.session.messages || [];
  // clear session messages
  req.session.messages = [];

  // send donationBinOperatorID to session.
  req.session.donationBinOperatorID = req.params.id;

  DonationBin.findAndCountAll({
    limit: req.query.limit,
    offset: req.skip,
    where: {
      donationBinOperatorID: req.session.donationBinOperatorID,
    },
  }).then((results) => {
    // for pagination.
    const itemCount = results.count;
    const pageCount = Math.ceil(results.count / req.query.limit);

    return res.render("donationBin/bins", {
      title: "BWG | Donation Bins",
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
