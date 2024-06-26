var express = require("express");
var router = express.Router();
// models.
const HawkerPeddlerPropertyOwner = require("../../models/hawkerPeddler/hawkerPeddlerPropertyOwner");
const HawkerPeddlerPropertyOwnerAddress = require("../../models/hawkerPeddler/hawkerPeddlerPropertyOwnerAddress");
const HawkerPeddlerOperator = require("../../models/hawkerPeddler/hawkerPeddlerOperator");
const HawkerPeddlerOperatorAddress = require("../../models/hawkerPeddler/hawkerPeddleOperatorAddress");
// express-validate.
const { body, param, validationResult } = require("express-validator");

/* GET /hawkerPeddler/business/:id */
router.get(
  "/:id",
  param("id").matches(/^\d+$/).trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...),
    if (!errors.isEmpty()) {
      return res.render("hawkerPeddler/business", {
        title: "BWG | Hawker & Peddler Business",
        message: "Page Error!",
        email: req.session.email,
        auth: req.session.auth, // authorization.
      });
    } else {
      // check if there's an error message in the session
      let messages = req.session.messages || [];
      // clear session messages
      req.session.messages = [];

      // send hawkerPeddlerBusinessID to session.
      req.session.hawkerPeddlerBusinessID = req.params.id;

      // get current date.
      var issueDate = new Date();
      // init expiryDate.
      var modalExpiryDate = new Date();

      // if issueDate is in November or December.
      if (issueDate.getMonth() === 10 || issueDate.getMonth() === 11) {
        modalExpiryDate = new Date(issueDate.getFullYear() + 2, 0, 31);
      } else {
        modalExpiryDate = new Date(issueDate.getFullYear() + 1, 0, 31); // year, month (jan = 0), day
      }

      Promise.all([
        HawkerPeddlerPropertyOwner.findAndCountAll({
          include: [
            {
              model: HawkerPeddlerPropertyOwnerAddress,
            },
          ],
          where: {
            hawkerPeddlerBusinessID: req.params.id,
          },
        }),
        HawkerPeddlerOperator.findAndCountAll({
          include: [
            {
              model: HawkerPeddlerOperatorAddress,
            },
          ],
          where: {
            hawkerPeddlerBusinessID: req.params.id,
          },
        }),
      ])
        .then((data) => {
          return res.render("hawkerPeddler/business", {
            title: "BWG | Hawker & Peddler Business",
            message: messages,
            email: req.session.email,
            auth: req.session.auth, // authorization.
            modalExpiryDate: modalExpiryDate,
            propertyOwners: data[0].rows,
            operators: data[1].rows,
            propertyOwnersCount: "Records returned: " + data[0].count,
            operatorsCount: "Records returned: " + data[1].count,
          });
        })
        .catch((err) => {
          return res.render("hawkerPeddler/business", {
            title: "BWG | Hawker & Peddler Business",
            message: "Page Error!",
            auth: req.session.auth, // authorization.
          });
        });
    }
  }
);

/* POST /hawkerPeddler/operator - renews license. */
router.post("/:id", async (req, res, next) => {
  // server side validation.
  const errors = validationResult(req);

  // if errors is NOT empty (if there are errors...).
  if (!errors.isEmpty()) {
    return res.render("hawkerPeddler/business", {
      title: "BWG | Hawker & Peddler Licensing",
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
      expiryDate = new Date(issueDate.getFullYear() + 2, 0, 31);
    } else {
      expiryDate = new Date(issueDate.getFullYear() + 1, 0, 31); // year, month (jan = 0), day
    }

    // update license.
    HawkerPeddlerOperator.update(
      {
        issueDate: issueDate,
        expiryDate: expiryDate,
        licenseNumber: req.body.licenseNumber,
      },
      {
        where: {
          hawkerPeddlerOperatorID: req.body.hawkerPeddlerOperatorID,
        },
      }
    )
      .then(() => {
        return res.redirect("/hawkerPeddler/business/" + req.params.id);
      })
      // catch any scary errors and render page error.
      .catch((err) => {
        return res.render("hawkerPeddler/business", {
          title: "BWG | Hawker & Peddler Licensing",
          message: "Page Error!",
          auth: req.session.auth, // authorization.
        });
      });
  }
});

module.exports = router;
