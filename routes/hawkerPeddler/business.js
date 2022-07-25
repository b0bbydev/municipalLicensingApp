var express = require("express");
var router = express.Router();
// models.
const HawkerPeddlerPropertyOwner = require("../../models/hawkerPeddler/hawkerPeddlerPropertyOwner");
const HawkerPeddlerPropertyOwnerAddress = require("../../models/hawkerPeddler/hawkerPeddlerPropertyOwnerAddress");
const HawkerPeddlerApplicant = require("../../models/hawkerPeddler/hawkerPeddlerApplicant");
const HawkerPeddlerApplicantAddress = require("../../models/hawkerPeddler/hawkerPeddlerApplicantAddress");

/* GET /hawkerPeddler/business/:id */
router.get("/:id", async (req, res, next) => {
  // check if there's an error message in the session
  let messages = req.session.messages || [];
  // clear session messages
  req.session.messages = [];

  // send hawkerPeddlerBusinessID to session.
  req.session.hawkerPeddlerBusinessID = req.params.id;

  Promise.all([
    HawkerPeddlerPropertyOwner.findAndCountAll({
      limit: req.query.limit,
      offset: req.skip,
      include: [
        {
          model: HawkerPeddlerPropertyOwnerAddress,
        },
      ],
    }),
    HawkerPeddlerApplicant.findAndCountAll({
      limit: req.query.limit,
      offset: req.skip,
      include: [
        {
          model: HawkerPeddlerApplicantAddress,
        },
      ],
    }),
  ]).then((data) => {
    return res.render("hawkerPeddler/business", {
      title: "BWG | Hawker & Peddler Business",
      errorMessages: messages,
      email: req.session.email,
      auth: req.session.auth, // authorization.
      propertyOwners: data[0].rows,
      applicants: data[1].rows,
      propertyOwnersCount: "Records returned: " + data[0].count,
      applicantsCount: "Records returned: " + data[1].count,
    });
  });
});

module.exports = router;
