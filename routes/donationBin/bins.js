var express = require("express");
var router = express.Router();
// models.
const DonationBinPropertyOwner = require("../../models/donationBin/donationBinPropertyOwner");
const DonationBinPropertyOwnerAddress = require("../../models/donationBin/donationBinPropertyOwnerAddress");
const DonationBinOperator = require("../../models/donationBin/donationBinOperator");
const DonationBinOperatorAddress = require("../../models/donationBin/donationBinOperatorAddress");
const DonationBinCharity = require("../../models/donationBin/donationBinCharity");
// express-validate.
const { param, validationResult } = require("express-validator");

/* GET /donationBin/bin/:id */
router.get(
  "/:id",
  param("id").matches(/^\d+$/).trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...),
    if (!errors.isEmpty()) {
      return res.render("donationBin/bin", {
        title: "BWG | Edit Donation Bin",
        message: "Page Error!",
        email: req.session.email,
        auth: req.session.auth, // authorization.
      });
    } else {
      // check if there's an error message in the session
      let messages = req.session.messages || [];
      // clear session messages
      req.session.messages = [];

      // send donationBinID to session.
      req.session.donationBinID = req.params.id;

      // get all data from donationBin tables.
      Promise.all([
        DonationBinPropertyOwner.findAndCountAll({
          include: [
            {
              model: DonationBinPropertyOwnerAddress,
            },
          ],
          where: {
            donationBinID: req.params.id,
          },
        }),
        DonationBinOperator.findAndCountAll({
          include: [
            {
              model: DonationBinOperatorAddress,
            },
          ],
          where: {
            donationBinID: req.params.id,
          },
        }),
        DonationBinCharity.findAndCountAll({
          where: {
            donationBinID: req.params.id,
          },
        }),
      ])
        .then((data) => {
          return res.render("donationBin/bin", {
            title: "BWG | Donation Bin",
            message: messages,
            email: req.session.email,
            auth: req.session.auth, // authorization.
            propertyOwners: data[0].rows,
            operators: data[1].rows,
            charities: data[2].rows,
            propertyOwnersCount: "Records returned: " + data[0].count,
            operatorsCount: "Records returned: " + data[1].count,
            charitiesCount: "Records returned: " + data[2].count,
          });
        })
        .catch((err) => {
          return res.render("donationBin/bin", {
            title: "BWG | Donation Bin",
            message: "Page Error!",
            auth: req.session.auth, // authorization.
          });
        });
    }
  }
);

module.exports = router;
