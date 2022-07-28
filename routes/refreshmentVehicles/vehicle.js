var express = require("express");
var router = express.Router();
// models.
const RefreshmentVehicle = require("../../models/refreshmentVehicles/refreshmentVehicle");
const RefreshmentVehiclePropertyOwner = require("../../models/refreshmentVehicles/refreshmentVehiclePropertyOwner");
const RefreshmentVehiclePropertyOwnerAddress = require("../../models/refreshmentVehicles/refreshmentVehiclePropertyOwnerAddress");
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
    RefreshmentVehiclePropertyOwner.findAll({
      where: {
        refreshmentVehicleID: req.session.refreshmentVehicleID,
      },
      include: [
        {
          model: RefreshmentVehiclePropertyOwnerAddress,
        },
      ],
    }),
  ]).then((data) => {
    return res.render("refreshmentVehicles/vehicle", {
      title: "BWG | Refreshment Vehicle Licensing",
      errorMessages: messages,
      email: req.session.email,
      auth: req.session.auth, // authorization.
      propertyOwners: data[0].rows,
      propertyOwnersCount: "Records returned: " + data[0].count,
    });
  });
});

module.exports = router;
