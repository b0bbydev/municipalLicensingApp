// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");
const RefreshmentPropertyOwner = require("./refreshmentVehiclePropertyOwner");
const RefreshmentPropertyOwnerAddress = require("./refreshmentVehiclePropertyOwnerAddress");

const RefreshmentVehiclePropertyOwnerAddressHistory = sequelize.define(
  "refreshmentVehiclePropertyOwnerAddressHistory",
  {
    refreshmentVehiclePropertyOwnerAddressHistoryID: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },

    action: {
      type: Sequelize.STRING(20),
      allowNull: false,
    },

    streetNumber: {
      type: Sequelize.INTEGER(10),
      allowNull: true,
    },

    streetName: {
      type: Sequelize.STRING(50),
      allowNull: true,
    },

    town: {
      type: Sequelize.STRING(30),
      allowNull: true,
    },

    postalCode: {
      type: Sequelize.STRING(15),
      allowNull: true,
    },

    lastModified: {
      type: Sequelize.DATE,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
);

RefreshmentPropertyOwner.hasMany(
  RefreshmentVehiclePropertyOwnerAddressHistory,
  {
    foreignKey: "refreshmentVehiclePropertyOwnerID",
  }
);

RefreshmentPropertyOwnerAddress.hasMany(
  RefreshmentVehiclePropertyOwnerAddressHistory,
  {
    foreignKey: "refreshmentVehiclePropertyOwnerAddressID",
  }
);

module.exports = RefreshmentVehiclePropertyOwnerAddressHistory;
