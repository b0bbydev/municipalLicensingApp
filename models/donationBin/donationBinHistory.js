// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");
const DonationBin = require("./donationBin");

const DonationBinHistory = sequelize.define(
  "donationBinHistory",
  {
    donationBinHistoryID: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },

    action: {
      type: Sequelize.STRING(20),
      allowNull: false,
    },

    licenseNumber: {
      type: Sequelize.STRING(15),
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

    lastModified: {
      type: Sequelize.DATE,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
);

DonationBin.hasMany(DonationBinHistory, {
  foreignKey: "donationBinID",
});

module.exports = DonationBinHistory;
