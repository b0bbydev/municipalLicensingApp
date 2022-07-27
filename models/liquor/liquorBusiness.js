// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");

const LiquorBusiness = sequelize.define("liquorbusiness", {
  liquorBusinessID: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  businessName: {
    type: Sequelize.STRING(30),
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

  dateStarted: {
    type: Sequelize.DATEONLY,
    allowNull: true,
  },

  applicationType: {
    type: Sequelize.ENUM("New", "Amendment"),
    allowNull: true,
  },

  feeReceived: {
    type: Sequelize.ENUM("Yes", "No"),
    allowNull: true,
  },

  municipalInformationSigned: {
    type: Sequelize.ENUM("Yes", "No"),
    allowNull: true,
  },

  municipalInformationSentToAGCO: {
    type: Sequelize.ENUM("Yes", "No"),
    allowNull: true,
  },

  fireApprovalReceived: {
    type: Sequelize.ENUM("Yes", "No"),
    allowNull: true,
  },

  fireSentToAGCO: {
    type: Sequelize.ENUM("Yes", "No"),
    allowNull: true,
  },

  planningApprovalReceived: {
    type: Sequelize.ENUM("Yes", "No"),
    allowNull: true,
  },

  planningSentToAGCO: {
    type: Sequelize.ENUM("Yes", "No"),
    allowNull: true,
  },

  smdhuApprovalReceived: {
    type: Sequelize.ENUM("Yes", "No"),
    allowNull: true,
  },

  smdhuSentToAGCO: {
    type: Sequelize.ENUM("Yes", "No"),
    allowNull: true,
  },

  buildingApprovalReceived: {
    type: Sequelize.ENUM("Yes", "No"),
    allowNull: true,
  },

  buildingSentToAGCO: {
    type: Sequelize.ENUM("Yes", "No"),
    allowNull: true,
  },

  licenseApproved: {
    type: Sequelize.ENUM("Yes", "No"),
    allowNull: true,
  },

  notes: {
    type: Sequelize.STRING(255),
    allowNull: true,
  },
});

module.exports = LiquorBusiness;
