// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");
const Kennel = require("./kennel");

const KennelHistory = sequelize.define(
  "kennelhistory",
  {
    kennelHistoryID: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },

    action: {
      type: Sequelize.STRING(20),
      allowNull: false,
    },

    kennelName: {
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

    licenseNumber: {
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

    notes: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },

    policeCheck: {
      type: Sequelize.ENUM("Yes", "No"),
      allowNull: true,
    },

    photoID: {
      type: Sequelize.ENUM("Yes", "No"),
      allowNull: true,
    },

    zoningClearance: {
      type: Sequelize.ENUM("Yes", "No"),
      allowNull: true,
    },

    acoInspection: {
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

Kennel.hasMany(KennelHistory, {
  foreignKey: "kennelID",
});

module.exports = KennelHistory;
