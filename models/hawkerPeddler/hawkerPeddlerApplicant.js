// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");
const HawkerPeddlerBusiness = require("./hawkerPeddlerBusiness");

const HawkerPeddlerApplicant = sequelize.define("hawkerPeddlerApplicant", {
  hawkerPeddlerApplicantID: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
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
});

HawkerPeddlerBusiness.hasMany(HawkerPeddlerApplicant, {
  foreignKey: "hawkerPeddlerBusinessID",
});

module.exports = HawkerPeddlerApplicant;
