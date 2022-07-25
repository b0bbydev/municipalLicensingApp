// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");

const Policy = sequelize.define("policy", {
  policyID: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  policyNumber: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },

  policyName: {
    type: Sequelize.STRING(40),
    allowNull: true,
  },

  cowDate: {
    type: Sequelize.DATEONLY,
    allowNull: true,
  },

  councilResolution: {
    type: Sequelize.STRING(30),
    allowNull: true,
  },

  dateApproved: {
    type: Sequelize.DATEONLY,
    allowNull: true,
  },

  dateAmended: {
    type: Sequelize.DATEONLY,
    allowNull: true,
  },

  dateEffective: {
    type: Sequelize.DATEONLY,
    allowNull: true,
  },

  category: {
    type: Sequelize.STRING(30),
    allowNull: true,
  },

  lastReviewDate: {
    type: Sequelize.DATEONLY,
    allowNull: true,
  },

  scheduledReviewDate: {
    type: Sequelize.DATEONLY,
    allowNull: true,
  },

  division: {
    type: Sequelize.STRING(30),
    allowNull: true,
  },

  authority: {
    type: Sequelize.STRING(30),
    allowNull: true,
  },

  administrator: {
    type: Sequelize.STRING(30),
    allowNull: true,
  },

  legislationRequired: {
    type: Sequelize.STRING(5),
    allowNull: true,
  },

  status: {
    type: Sequelize.ENUM("Archive", "Active", "Draft"),
    allowNull: true,
  },

  fileHoldURL: {
    type: Sequelize.STRING(255),
    allowNull: true,
  },

  notes: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

module.exports = Policy;
