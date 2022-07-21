// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");
var DonationBin = require("../../models/donationBin/donationBin");

const DonationBinOperator = sequelize.define("donationBinOperator", {
  donationBinOperatorID: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  firstName: {
    type: Sequelize.STRING(25),
    allowNull: true,
  },

  lastName: {
    type: Sequelize.STRING(25),
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

  licenseNumber: {
    type: Sequelize.STRING(50),
    allowNull: true,
  },

  photoID: {
    type: Sequelize.ENUM("Yes", "No"),
    allowNull: true,
  },

  charityInformation: {
    type: Sequelize.ENUM("Yes", "No"),
    allowNull: true,
  },

  sitePlan: {
    type: Sequelize.ENUM("Yes", "No"),
    allowNull: true,
  },

  certificateOfInsurance: {
    type: Sequelize.ENUM("Yes", "No"),
    allowNull: true,
  },

  ownerConsent: {
    type: Sequelize.ENUM("Yes", "No"),
    allowNull: true,
  },
});

// create relationship with donationBin.
DonationBin.hasMany(DonationBinOperator, {
  foreignKey: "donationBinID",
});

module.exports = DonationBinOperator;
