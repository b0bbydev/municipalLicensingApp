// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");
var DonationBinPropertyOwner = require("../../models/donationBin/donationBinPropertyOwner");

const DonationBin = sequelize.define("donationBin", {
  donationBinID: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  itemsCollected: {
    type: Sequelize.STRING(255),
    allowNull: true,
  },

  pickupSchedule: {
    type: Sequelize.STRING(255),
    allowNull: true,
  },

  colour: {
    type: Sequelize.STRING(25),
    allowNull: true,
  },

  material: {
    type: Sequelize.STRING(50),
    allowNull: true,
  },

  notes: {
    type: Sequelize.STRING(255),
    allowNull: true,
  },
});

// create relationship with donationBin.
DonationBinPropertyOwner.hasMany(DonationBin, {
  foreignKey: "donationBinPropertyOwnerID",
});

module.exports = DonationBin;
