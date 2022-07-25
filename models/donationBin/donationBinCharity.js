// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");
const DonationBin = require("./donationBin");

const DonationBinCharity = sequelize.define("donationBinCharity", {
  donationBinCharityID: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  charityName: {
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

  organizationType: {
    type: Sequelize.ENUM("Charity", "Not-For-Profit", "For-Profit"),
    allowNull: true,
  },
});

DonationBin.hasMany(DonationBinCharity, {
  foreignKey: "donationBinID",
});

module.exports = DonationBinCharity;
