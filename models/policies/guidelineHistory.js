// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");
const Policy = require("./policy");
const Guideline = require("./guideline");

const GuidelineHistory = sequelize.define(
  "guidelinehistory",
  {
    guidelineHistoryID: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },

    action: {
      type: Sequelize.STRING(20),
      allowNull: false,
    },

    guidelineNumber: {
      type: Sequelize.STRING(30),
      allowNull: true,
    },

    guidelineName: {
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

    lastModified: {
      type: Sequelize.DATE,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
);

Policy.hasMany(GuidelineHistory, {
  foreignKey: "policyID",
});

Guideline.hasMany(GuidelineHistory, {
  foreignKey: "guidelineID",
});

module.exports = GuidelineHistory;
