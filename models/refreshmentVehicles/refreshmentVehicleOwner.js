// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");
const RefreshmentVehicle = require("./refreshmentVehicle");

const RefreshmentVehicleOwner = sequelize.define("refreshmentVehicleOwner", {
  refreshmentVehicleOwnerID: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  firstName: {
    type: Sequelize.STRING(25),
    allowNull: true,
  },

  lastName: {
    type: Sequelize.STRING(25),
    allowNull: true,
  },

  phoneNumber: {
    type: Sequelize.STRING(25),
    allowNull: true,
  },

  email: {
    type: Sequelize.STRING(50),
    allowNull: true,
  },
});

RefreshmentVehicle.hasMany(RefreshmentVehicleOwner, {
  foreignKey: "refreshmentVehicleID",
});

module.exports = RefreshmentVehicleOwner;
