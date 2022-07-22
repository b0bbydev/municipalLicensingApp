var express = require("express");
var router = express.Router();
// models.
var HawkerPeddlerBusiness = require("../../models/hawkerPeddler/hawkerPeddlerBusiness");
var HawkerPeddlerBusinessAddress = require("../../models/hawkerPeddler/hawkerPeddlerBusinessAddress");
// pagination lib.
const paginate = require("express-paginate");

/* GET /hawkerPeddler/businesses/:id */
router.get("/:id", async (req, res, next) => {
  // check if there's an error message in the session
  let messages = req.session.messages || [];
  // clear session messages
  req.session.messages = [];

  req.session.hawkerPeddlerPropertyOwnerID = req.params.id;

  HawkerPeddlerBusiness.findAndCountAll({
    limit: req.query.limit,
    offset: req.skip,
    include: [
      {
        model: HawkerPeddlerBusinessAddress,
      },
    ],
  }).then((results) => {
    // for pagination.
    const itemCount = results.count;
    const pageCount = Math.ceil(results.count / req.query.limit);

    return res.render("hawkerPeddler/businesses", {
      title: "BWG | Hawker & Peddler Businesses",
      errorMessages: messages,
      email: req.session.email,
      auth: req.session.auth, // authorization.
      hawkerPeddlerPropertyOwnerID: req.session.hawkerPeddlerPropertyOwnerID,
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
