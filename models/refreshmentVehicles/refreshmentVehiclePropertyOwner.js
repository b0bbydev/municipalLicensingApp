// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");
const RefreshmentVehicle = require("./refreshmentVehicle");

const RefreshmentVehiclePropertyOwner = sequelize.define(
  "refreshmentVehiclePropertyOwner",
  {
    refreshmentVehiclePropertyOwnerID: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },

    firstName: {
      type: Sequelize.STRING(50),
      allowNull: true,
    },

    lastName: {
      type: Sequelize.STRING(50),
      allowNull: true,
    },

    phoneNumber: {
      type: Sequelize.STRING(20),
      allowNull: true,
    },

    email: {
      type: Sequelize.STRING(50),
      allowNull: true,
    },
  }
);

RefreshmentVehicle.hasMany(RefreshmentVehiclePropertyOwner, {
  foreignKey: "refreshmentVehicleID",
});

module.exports = RefreshmentVehiclePropertyOwner;
