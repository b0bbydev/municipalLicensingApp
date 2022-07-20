// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");
const DonationBin = require("../donationBin/donationBin");

const DonationBinCharity = sequelize.define("donationBinCharity", {
  donationBinCharityID: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  name: {
    type: Sequelize.STRING(50),
    allowNull: true,
  },

  registrationNumber: {
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

  issueDate: {
    type: Sequelize.DATEONLY,
    allowNull: true,
  },

  expiryDate: {
    type: Sequelize.DATEONLY,
    allowNull: true,
  },

  organizationType: {
    type: Sequelize.ENUM("Charity", "Not-For-Profit", "For-Profit"),
    allowNull: true,
  },
});

// create relationship with donationBin table.
DonationBin.hasMany(DonationBinCharity, {
  foreignKey: "donationBinID",
});

module.exports = DonationBinCharity;