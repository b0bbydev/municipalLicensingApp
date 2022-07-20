// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");

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
});

module.exports = DonationBin;