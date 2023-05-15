// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");
const HawkerPeddlerBusiness = require("./hawkerPeddlerBusiness");

const HawkerPeddlerBusinessHistory = sequelize.define(
  "hawkerPeddlerBusinessHistory",
  {
    hawkerPeddlerBusinessHistoryID: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },

    action: {
      type: Sequelize.STRING(20),
      allowNull: false,
    },

    businessName: {
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

    itemsForSale: {
      type: Sequelize.STRING(255),
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

    sitePlan: {
      type: Sequelize.ENUM("Yes", "No"),
      allowNull: true,
    },

    zoningClearance: {
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

HawkerPeddlerBusiness.hasMany(HawkerPeddlerBusinessHistory, {
  foreignKey: "hawkerPeddlerBusinessID",
});

module.exports = HawkerPeddlerBusinessHistory;
