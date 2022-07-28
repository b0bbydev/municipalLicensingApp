var express = require("express");
var router = express.Router();
// models.
const RefreshmentVehiclePropertyOwner = require("../../models/refreshmentVehicles/refreshmentVehiclePropertyOwner");
const RefreshmentVehiclePropertyOwnerAddress = require("../../models/refreshmentVehicles/refreshmentVehiclePropertyOwnerAddress");
const RefreshmentVehicleOwner = require("../../models/refreshmentVehicles/refreshmentVehicleOwner");
const RefreshmentVehicleOwnerAddress = require("../../models/refreshmentVehicles/refreshmentVehicleOwnerAddress");
const RefreshmentVehicleOperator = require("../../models/refreshmentVehicles/refreshmentVehicleOperator");
const RefreshmentVehicleOperatorAddress = require("../../models/refreshmentVehicles/refreshmentVehicleOperatorAddress");
// sequelize.
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
// pagination lib.
const paginate = require("express-paginate");
// express-validate.
const { body, validationResult } = require("express-validator");

/* GET /refreshmentVehicles/vehicle/:id */
router.get("/:id", async (req, res, next) => {
  // check if there's an error message in the session
  let messages = req.session.messages || [];
  // clear session messages
  req.session.messages = [];

  // send refreshmentVehicleID to session.
  req.session.refreshmentVehicleID = req.params.id;

  Promise.all([
    RefreshmentVehiclePropertyOwner.findAndCountAll({
      limit: req.query.limit,
      offset: req.skip,
      include: [
        {
          model: RefreshmentVehiclePropertyOwnerAddress,
        },
      ],
      where: {
        refreshmentVehicleID: req.session.refreshmentVehicleID,
      },
    }),
    RefreshmentVehicleOwner.findAndCountAll({
      limit: req.query.limit,
      offset: req.skip,
      include: [
        {
          model: RefreshmentVehicleOwnerAddress,
        },
      ],
      where: {
        refreshmentVehicleID: req.session.refreshmentVehicleID,
      },
    }),
    RefreshmentVehicleOperator.findAndCountAll({
      limit: req.query.limit,
      offset: req.skip,
      include: [
        {
          model: RefreshmentVehicleOperatorAddress,
        },
      ],
      where: {
        refreshmentVehicleID: req.session.refreshmentVehicleID,
      },
    }),
  ]).then((data) => {
    return res.render("refreshmentVehicles/vehicle", {
      title: "BWG | Refreshment Vehicle Licensing",
      errorMessages: messages,
      email: req.session.email,
      auth: req.session.auth, // authorization.
      propertyOwners: data[0].rows,
      vehicleOwners: data[1].rows,
      vehicleOperators: data[2].rows,
      propertyOwnersCount: "Records returned: " + data[0].count,
      vehicleOwnersCount: "Records returned: " + data[1].count,
      vehicleOperatorsCount: "Records returned: " + data[2].count,
    });
  });
});

module.exports = router;
