// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");
const HawkerPeddlerOperator = require("./hawkerPeddlerOperator");
const HawkerPeddlerOperatorAddress = require("./hawkerPeddleOperatorAddress");

const HawkerPeddlerOperatorAddressHistory = sequelize.define(
  "HawkerPeddlerOperatorAddressHistory",
  {
    hawkerPeddlerOperatorAddressHistoryID: {
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

HawkerPeddlerOperator.hasMany(HawkerPeddlerOperatorAddressHistory, {
  foreignKey: "hawkerPeddlerOperatorID",
});

HawkerPeddlerOperatorAddress.hasMany(HawkerPeddlerOperatorAddressHistory, {
  foreignKey: "hawkerPeddlerOperatorAddressID",
});

module.exports = HawkerPeddlerOperatorAddressHistory;
