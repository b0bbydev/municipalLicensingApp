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
    type: Sequelize.STRING,
    allowNull: true,
  },

  cowResolve: {
    type: Sequelize.DATE,
    allowNull: true,
  },

  cowDate: {
    type: Sequelize.DATE,
    allowNull: true,
  },

  councilResolution: {
    type: Sequelize.STRING,
    allowNull: true,
  },

  dateAdopted: {
    type: Sequelize.DATE,
    allowNull: true,
  },

  amended: {
    type: Sequelize.DATE,
    allowNull: true,
  },

  lastReviewDate: {
    type: Sequelize.DATE,
    allowNull: true,
  },

  scheduledReviewDate: {
    type: Sequelize.DATE,
    allowNull: true,
  },

  status: {
    type: Sequelize.ENUM("Archive", "Active", "Draft"),
    allowNull: true,
  },

  notes: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

module.exports = Policy;
