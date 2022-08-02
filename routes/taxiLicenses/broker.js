var express = require("express");
var router = express.Router();
// models.
const TaxiDriver = require("../../models/taxiLicenses/taxiDriver");
const TaxiDriverAddress = require("../../models/taxiLicenses/taxiDriverAddress");

/* GET /taxiLicenses/broker/:id */
router.get("/:id", async (req, res, next) => {
  // check if there's an error message in the session
  let messages = req.session.messages || [];
  // clear session messages
  req.session.messages = [];

  // send taxiBrokerID to session.
  req.session.brokerID = req.params.id;

  Promise.all([
    TaxiDriver.findAndCountAll({
      limit: req.query.limit,
      offset: req.skip,
      include: [
        {
          model: TaxiDriverAddress,
        },
      ],
      where: {
        taxiBrokerID: req.params.id,
      },
    }),
  ]).then((data) => {
    return res.render("taxiLicenses/broker", {
      title: "BWG | Taxi Licenses",
      errorMessages: messages,
      email: req.session.email,
      auth: req.session.auth, // authorization.
      taxiDrivers: data[0].rows,
      taxiDriversCount: "Records returned: " + data[0].count,
    });
  });
});

module.exports = router;
