var express = require("express");
var router = express.Router();
// models.
const KennelPropertyOwner = require("../../models/kennel/kennelPropertyOwner");
const KennelPropertyOwnerAddress = require("../../models/kennel/kennelPropertyOwnerAddress");
const KennelOwner = require("../../models/kennel/kennelOwner");
const KennelOwnerAddress = require("../../models/kennel/kennelOwnerAddress");
// express-validate.
const { body, validationResult } = require("express-validator");

/* GET /kennels/kennel/:id page. */
router.get("/:id", async (req, res, next) => {
  // check if there's an error message in the session
  let messages = req.session.messages || [];
  // clear session messages
  req.session.messages = [];

  // send kennelID to session.
  req.session.kennelID = req.params.id;

  Promise.all([
    KennelPropertyOwner.findAndCountAll({
      limit: req.query.limit,
      offset: req.skip,
      include: [
        {
          model: KennelPropertyOwnerAddress,
        },
      ],
      where: {
        kennelID: req.params.id,
      },
    }),
    KennelOwner.findAndCountAll({
      limit: req.query.limit,
      offset: req.skip,
      include: [
        {
          model: KennelOwnerAddress,
        },
      ],
      where: {
        kennelID: req.params.id,
      },
    }),
  ]).then((data) => {
    return res.render("kennels/kennel", {
      title: "BWG | Kennel Licensing",
      errorMessages: messages,
      email: req.session.email,
      auth: req.session.auth, // authorization.
      propertyOwners: data[0].rows,
      kennelOwners: data[1].rows,
      propertyOwnersCount: "Records returned: " + data[0].count,
      kennelOwnersCount: "Records returned: " + data[1].count,
    });
  });
});

module.exports = router;
