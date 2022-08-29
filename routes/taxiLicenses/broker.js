var express = require("express");
var router = express.Router();
// models.
const TaxiDriver = require("../../models/taxiLicenses/taxiDriver");
const TaxiDriverAddress = require("../../models/taxiLicenses/taxiDriverAddress");
const TaxiPlate = require("../../models/taxiLicenses/taxiPlate");
const TaxiPlateOwnerAddress = require("../../models/taxiLicenses/taxiPlateOwnerAddress");
// express-validate.
const { body, validationResult } = require("express-validator");

/* GET /taxiLicenses/broker/:id */
router.get("/:id", async (req, res, next) => {
  // check if there's an error message in the session
  let messages = req.session.messages || [];
  // clear session messages
  req.session.messages = [];

  // send taxiBrokerID to session.
  req.session.brokerID = req.params.id;

  // get current date.
  var issueDate = new Date();
  // init expiryDate.
  var modalExpiryDate = new Date();

  // if issueDate is in November or December.
  if (issueDate.getMonth() === 10 || issueDate.getMonth() === 11) {
    modalExpiryDate = new Date(issueDate.getFullYear() + 2, 2, 31);
  } else {
    modalExpiryDate = new Date(issueDate.getFullYear() + 1, 2, 31); // year, month (march = 2), day
  }

  Promise.all([
    TaxiDriver.findAndCountAll({
      include: [
        {
          model: TaxiDriverAddress,
        },
      ],
      where: {
        taxiBrokerID: req.params.id,
      },
    }),
    TaxiPlate.findAndCountAll({
      include: [
        {
          model: TaxiPlateOwnerAddress,
        },
      ],
      where: {
        taxiBrokerID: req.params.id,
      },
    }),
  ])
    .then((data) => {
      return res.render("taxiLicenses/broker", {
        title: "BWG | Taxi Licenses",
        message: messages,
        email: req.session.email,
        auth: req.session.auth, // authorization.
        modalExpiryDate: modalExpiryDate,
        taxiDrivers: data[0].rows,
        taxiPlates: data[1].rows,
        taxiDriversCount: "Records returned: " + data[0].count,
        taxiPlatesCount: "Records returned: " + data[1].count,
      });
    })
    .catch((err) => {
      return res.render("taxiLicenses/broker", {
        title: "BWG | Taxi Licenses",
        message: "Page Error!",
        auth: req.session.auth, // authorization.
      });
    });
});

/* POST /taxiLicenses/broker/renewDriver - renews license. */
router.post("/renewDriver", async (req, res, next) => {
  // server side validation.
  const errors = validationResult(req);

  // if errors is NOT empty (if there are errors...).
  if (!errors.isEmpty()) {
    return res.render("taxiLicenses/broker", {
      title: "BWG | Taxi Licenses",
      message: "Page Error!",
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
      expiryDate = new Date(issueDate.getFullYear() + 2, 2, 31);
    } else {
      expiryDate = new Date(issueDate.getFullYear() + 1, 2, 31); // year, month (march = 2), day
    }

    // update license.
    TaxiDriver.update(
      {
        issueDate: issueDate,
        expiryDate: expiryDate,
      },
      {
        where: {
          taxiDriverID: req.body.taxiDriverID,
        },
      }
    )
      .then(() => {
        return res.redirect("/taxiLicenses/broker/" + req.session.brokerID);
      })
      .catch((err) => {
        return res.render("taxiLicenses/broker", {
          title: "BWG | Taxi Licenses",
          message: "Page Error!",
          auth: req.session.auth, // authorization.
        });
      });
  }
});

/* POST /taxiLicenses/broker/renewPlate - renews license. */
router.post("/renewPlate", async (req, res, next) => {
  // server side validation.
  const errors = validationResult(req);

  // if errors is NOT empty (if there are errors...).
  if (!errors.isEmpty()) {
    return res.render("taxiLicenses/broker", {
      title: "BWG | Taxi Licenses",
      message: "Page Error!",
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
      expiryDate = new Date(issueDate.getFullYear() + 2, 2, 31);
    } else {
      expiryDate = new Date(issueDate.getFullYear() + 1, 2, 31); // year, month (march = 2), day
    }

    // update license.
    TaxiPlate.update(
      {
        issueDate: issueDate,
        expiryDate: expiryDate,
      },
      {
        where: {
          taxiPlateID: req.body.taxiPlateID,
        },
      }
    )
      .then(() => {
        return res.redirect("/taxiLicenses/broker/" + req.session.brokerID);
      })
      .catch((err) => {
        return res.render("taxiLicenses/broker", {
          title: "BWG | Taxi Licenses",
          message: "Page Error!",
          auth: req.session.auth, // authorization.
        });
      });
  }
});

module.exports = router;
