// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");
var DonationBinOperator = require("../../models/donationBin/donationBinOperator");

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

  charityPhoneNumber: {
    type: Sequelize.STRING(20),
    allowNull: true,
  },

  charityEmail: {
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

// create relationship with donationBin.
DonationBinOperator.hasMany(DonationBinCharity, {
  foreignKey: "donationBinOperatorID",
});

module.exports = DonationBinCharity;
