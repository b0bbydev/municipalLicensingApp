// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");
const DonationBinPropertyOwner = require("../donationBin/donationBinPropertyOwner");

const DonationBinPropertyOwnerAddress = sequelize.define(
  "donationBinPropertyOwnerAddress",
  {
    donationBinPropertyOwnerAddressID: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
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
  }
);

// create relationship with donationBinPropertyOwner table.
DonationBinPropertyOwner.hasMany(DonationBinPropertyOwnerAddress, {
  foreignKey: "donationBinPropertyOwnerID",
});

module.exports = DonationBinPropertyOwnerAddress;
