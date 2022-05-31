// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");
const Policy = require("./policy");
const PolicyForms = require("./policyForms");

const Guideline = sequelize.define("guideline", {
  guidelineID: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  guidelineName: {
    type: Sequelize.STRING,
    allowNull: true,
  },

  approvalDate: {
    type: Sequelize.DATEONLY,
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

  amended: {
    type: Sequelize.DATEONLY,
    allowNull: true,
  },

  status: {
    type: Sequelize.STRING,
    allowNull: true,
  },

  notes: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

Policy.hasMany(Guideline, {
  foreignKey: "policyID",
});

PolicyForms.hasMany(Guideline, {
  foreignKey: "policyFormID",
});

module.exports = Guideline;
