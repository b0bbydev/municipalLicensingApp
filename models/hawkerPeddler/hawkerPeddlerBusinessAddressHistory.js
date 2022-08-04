// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");
const HawkerPeddlerBusiness = require("./hawkerPeddlerBusiness");
const HawkerPeddlerBusinessAddress = require("./hawkerPeddlerBusinessAddress");

const HawkerPeddlerBusinessAddressHistory = sequelize.define(
  "hawkerPeddlerBusinessAddressHistory",
  {
    hawkerPeddlerBusinessAddressHistoryID: {
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

HawkerPeddlerBusiness.hasMany(HawkerPeddlerBusinessAddressHistory, {
  foreignKey: "hawkerPeddlerBusinessID",
});

HawkerPeddlerBusinessAddress.hasMany(HawkerPeddlerBusinessAddressHistory, {
  foreignKey: "hawkerPeddlerBusinessAddressID",
});

module.exports = HawkerPeddlerBusinessAddressHistory;
