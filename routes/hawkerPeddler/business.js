var express = require("express");
var router = express.Router();
// models.
const HawkerPeddlerPropertyOwner = require("../../models/hawkerPeddler/hawkerPeddlerPropertyOwner");
const HawkerPeddlerPropertyOwnerAddress = require("../../models/hawkerPeddler/hawkerPeddlerPropertyOwnerAddress");

/* GET /hawkerPeddler/business/:id */
router.get("/:id", async (req, res, next) => {
  // check if there's an error message in the session
  let messages = req.session.messages || [];
  // clear session messages
  req.session.messages = [];

  // send hawkerPeddlerBusinessID to session.
  req.session.hawkerPeddlerBusinessID = req.params.id;

  HawkerPeddlerPropertyOwner.findAndCountAll({
    limit: req.query.limit,
    offset: req.skip,
    include: [
      {
        model: HawkerPeddlerPropertyOwnerAddress,
      },
    ],
  }).then((results) => {
    return res.render("hawkerPeddler/business", {
      title: "BWG | Hawker & Peddler Business",
      errorMessages: messages,
      email: req.session.email,
      auth: req.session.auth, // authorization.
      data: results.rows,
      queryCount: "Records returned: " + results.count,
    });
  });
});

module.exports = router;
