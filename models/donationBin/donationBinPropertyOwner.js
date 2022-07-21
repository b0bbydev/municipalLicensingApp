// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");
const DonationBinCharity = require("./donationBinCharity");

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

// create relationship with donationBinOperator table.
DonationBinCharity.hasMany(DonationBinPropertyOwner, {
  foreignKey: "donationBinCharityID",
});

module.exports = DonationBinPropertyOwner;
