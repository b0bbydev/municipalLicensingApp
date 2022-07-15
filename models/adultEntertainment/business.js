// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");

const Business = sequelize.define("business", {
  businessID: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  businessName: {
    type: Sequelize.STRING(30),
    allowNull: true,
  },

  ownerName: {
    type: Sequelize.STRING(50),
    allowNull: true,
  },

  contactName: {
    type: Sequelize.STRING(50),
    allowNull: true,
  },

  contactPhone: {
    type: Sequelize.STRING(15),
    allowNull: true,
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

  policeVSC: {
    type: Sequelize.ENUM("Yes", "No"),
    allowNull: true,
  },

  certificateOfInsurance: {
    type: Sequelize.ENUM("Yes", "No"),
    allowNull: true,
  },

  photoID: {
    type: Sequelize.ENUM("Yes", "No"),
    allowNull: true,
  },

  healthInspection: {
    type: Sequelize.ENUM("Yes", "No"),
    allowNull: true,
  },

  zoningClearance: {
    type: Sequelize.ENUM("Yes", "No"),
    allowNull: true,
  },

  feePaid: {
    type: Sequelize.ENUM("Yes", "No"),
    allowNull: true,
  },

  notes: {
    type: Sequelize.STRING(255),
    allowNull: true,
  },
});

module.exports = Business;
