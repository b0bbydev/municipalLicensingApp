// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");
const Policy = require("./policy");
const PolicyForms = require("./policyForms");

const Procedure = sequelize.define("procedure", {
  procedureID: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  procedureName: {
    type: Sequelize.STRING,
    allowNull: true,
  },

  approvalDate: {
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

  amended: {
    type: Sequelize.DATE,
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

Policy.hasMany(Procedure, {
  foreignKey: "policyID",
});

PolicyForms.hasMany(Procedure, {
  foreignKey: "policyFormID",
});

module.exports = Procedure;
