// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");
const DonationBin = require("../donationBin/donationBin");

const DonationBinPropertyOwner = sequelize.define("donationBinPropertyOwner", {
  donationBinPropertyOwnerID: {
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
});

// create relationship with donationBin table.
DonationBin.hasMany(DonationBinPropertyOwner, {
  foreignKey: "donationBinID",
});

module.exports = DonationBinPropertyOwner;
