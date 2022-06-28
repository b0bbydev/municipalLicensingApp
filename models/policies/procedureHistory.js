// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");
const Policy = require("./policy");
const PolicyHistory = require("./policyHistory");
const Procedure = require("./procedure");

const ProcedureHistory = sequelize.define(
  "procedurehistory",
  {
    procedureHistoryID: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },

    action: {
      type: Sequelize.STRING(20),
      allowNull: false,
    },

    procedureName: {
      type: Sequelize.STRING(40),
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

    dateAmended: {
      type: Sequelize.DATEONLY,
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

    lastModified: {
      type: Sequelize.DATE,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
);

Policy.hasMany(ProcedureHistory, {
  foreignKey: "policyID",
});

PolicyHistory.hasMany(ProcedureHistory, {
  foreignKey: "policyHistoryID",
});

Procedure.hasMany(ProcedureHistory, {
  foreignKey: "procedureID",
});

module.exports = ProcedureHistory;
