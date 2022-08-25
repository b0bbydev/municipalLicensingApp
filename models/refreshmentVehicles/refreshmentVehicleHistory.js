// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");
const RefreshmentVehicle = require("./refreshmentVehicle");

const RefreshmentVehicleHistory = sequelize.define(
  "refreshmentVehicleHistory",
  {
    refreshmentVehicleHistoryID: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },

    action: {
      type: Sequelize.STRING(20),
      allowNull: false,
    },

    registeredBusinessName: {
      type: Sequelize.STRING(50),
      allowNull: true,
    },

    operatingBusinessName: {
      type: Sequelize.STRING(50),
      allowNull: true,
    },

    licenseNumber: {
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

    specialEvent: {
      type: Sequelize.ENUM("Yes", "No"),
      allowNull: true,
    },

    itemsForSale: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },

    notes: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },

    policeVSC: {
      type: Sequelize.ENUM("Yes", "No"),
      allowNull: true,
    },

    photoID: {
      type: Sequelize.ENUM("Yes", "No"),
      allowNull: true,
    },

    driversAbstract: {
      type: Sequelize.ENUM("Yes", "No"),
      allowNull: true,
    },

    safetyCertificate: {
      type: Sequelize.ENUM("Yes", "No"),
      allowNull: true,
    },

    vehicleOwnership: {
      type: Sequelize.ENUM("Yes", "No"),
      allowNull: true,
    },

    citizenship: {
      type: Sequelize.ENUM("Yes", "No"),
      allowNull: true,
    },

    insurance: {
      type: Sequelize.ENUM("Yes", "No"),
      allowNull: true,
    },

    fireApproval: {
      type: Sequelize.ENUM("Yes", "No"),
      allowNull: true,
    },

    zoningClearance: {
      type: Sequelize.ENUM("Yes", "No"),
      allowNull: true,
    },

    healthInspection: {
      type: Sequelize.ENUM("Yes", "No"),
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

RefreshmentVehicle.hasMany(RefreshmentVehicleHistory, {
  foreignKey: "refreshmentVehicleID",
});

module.exports = RefreshmentVehicleHistory;
