// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");
const Policy = require("./policy");

const Procedure = sequelize.define("procedure", {
  procedureID: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  procedureNumber: {
    type: Sequelize.STRING(30),
    allowNull: true,
  },

  procedureName: {
    type: Sequelize.STRING(80),
    allowNull: true,
  },

  dateApproved: {
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
    type: Sequelize.STRING(25),
    allowNull: true,
  },

  category: {
    type: Sequelize.STRING(25),
    allowNull: true,
  },

  division: {
    type: Sequelize.STRING(45),
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

  fileHoldURL: {
    type: Sequelize.STRING(255),
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

module.exports = Procedure;
