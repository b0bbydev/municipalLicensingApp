// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");
const HawkerPeddlerApplicant = require("./hawkerPeddlerApplicant");

const HawkerPeddlerOperatorHistory = sequelize.define(
  "hawkerPeddlerOperatorHistory",
  {
    hawkerPeddlerOperatorHistoryID: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },

    action: {
      type: Sequelize.STRING(20),
      allowNull: false,
    },

    firstName: {
      type: Sequelize.STRING(50),
      allowNull: true,
    },

    lastName: {
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

    lastModified: {
      type: Sequelize.DATE,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
);

HawkerPeddlerApplicant.hasMany(HawkerPeddlerOperatorHistory, {
  foreignKey: "hawkerPeddlerApplicantID",
});

module.exports = HawkerPeddlerOperatorHistory;
