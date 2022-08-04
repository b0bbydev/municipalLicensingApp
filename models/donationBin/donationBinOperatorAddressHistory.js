// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");
const DonationBinOperator = require("../donationBin/donationBinOperator");
const DonationBinOperatorAddress = require("../donationBin/donationBinOperatorAddress");

const DonationBinOperatorAddressHistory = sequelize.define(
  "donationBinOperatorAddressHistory",
  {
    donationBinOperatorAddressHistoryID: {
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

DonationBinOperator.hasMany(DonationBinOperatorAddressHistory, {
  foreignKey: "donationBinOperatorID",
});

DonationBinOperatorAddress.hasMany(DonationBinOperatorAddressHistory, {
  foreignKey: "donationBinOperatorAddressID",
});

module.exports = DonationBinOperatorAddressHistory;
