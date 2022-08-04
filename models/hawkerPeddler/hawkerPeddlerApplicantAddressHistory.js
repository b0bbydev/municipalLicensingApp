// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");
const HawkerPeddlerApplicant = require("./hawkerPeddlerApplicant");
const HawkerPeddlerApplicantAddress = require("./hawkerPeddlerApplicantAddress");

const HawkerPeddlerApplicantAddressHistory = sequelize.define(
  "hawkerPeddlerApplicantAddressHistory",
  {
    hawkerPeddlerApplicantAddressHistoryID: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },

    action: {
      type: Sequelize.STRING(20),
      allowNull: false,
    },

    streetNumber: {
      type: Sequelize.INTEGER(10),
      allowNull: true,
    },

    streetName: {
      type: Sequelize.STRING(50),
      allowNull: true,
    },

    town: {
      type: Sequelize.STRING(30),
      allowNull: true,
    },

    postalCode: {
      type: Sequelize.STRING(15),
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

HawkerPeddlerApplicant.hasMany(HawkerPeddlerApplicantAddressHistory, {
  foreignKey: "hawkerPeddlerApplicantID",
});

HawkerPeddlerApplicantAddress.hasMany(HawkerPeddlerApplicantAddressHistory, {
  foreignKey: "hawkerPeddlerApplicantAddressID",
});

module.exports = HawkerPeddlerApplicantAddressHistory;
