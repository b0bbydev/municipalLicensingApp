// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");
const TaxiDriver = require("./taxiDriver");

const TaxiDriverHistory = sequelize.define(
  "taxiDriverHistory",
  {
    taxiDriverHistoryID: {
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
      type: Sequelize.STRING(25),
      allowNull: true,
    },

    lastName: {
      type: Sequelize.STRING(25),
      allowNull: true,
    },

    phoneNumber: {
      type: Sequelize.STRING(15),
      allowNull: true,
    },

    cabCompany: {
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

    policeVSC: {
      type: Sequelize.ENUM("Yes", "No"),
      allowNull: true,
    },

    citizenship: {
      type: Sequelize.ENUM("Yes", "No"),
      allowNull: true,
    },

    photoID: {
      type: Sequelize.ENUM("Yes", "No"),
      allowNull: true,
    },

    driversAbstract: {
      type: Sequelize.ENUM("Yes", "No"),
      allowNull: true,
    },

    notes: {
      type: Sequelize.STRING(255),
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

TaxiDriver.hasMany(TaxiDriverHistory, {
  foreignKey: "taxiDriverID",
});

module.exports = TaxiDriverHistory;
