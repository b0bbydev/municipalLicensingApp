// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");
const DonationBinPropertyOwner = require("../donationBin/donationBinPropertyOwner");
const DonationBinPropertyOwnerAddress = require("../donationBin/donationBinPropertyOwnerAddress");

const DonationBinPropertyOwnerAddressHistory = sequelize.define(
  "donationBinPropertyOwnerAddressHistory",
  {
    donationBinPropertyOwnerAddressHistoryID: {
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

DonationBinPropertyOwner.hasMany(DonationBinPropertyOwnerAddressHistory, {
  foreignKey: "donationBinPropertyOwnerID",
});

DonationBinPropertyOwnerAddress.hasMany(
  DonationBinPropertyOwnerAddressHistory,
  {
    foreignKey: "donationBinPropertyOwnerAddressID",
  }
);

module.exports = DonationBinPropertyOwnerAddressHistory;
