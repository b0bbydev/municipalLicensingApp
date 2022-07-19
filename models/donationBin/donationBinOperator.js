// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");

const Operator = sequelize.define("Operator", {
  operatorID: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
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
    type: Sequelize.STRING(20),
    allowNull: true,
  },

  email: {
    type: Sequelize.STRING(50),
    allowNull: true,
  },

  organizationName: {
    type: Sequelize.STRING(50),
    allowNull: true,
  },

  registrationNumber: {
    type: Sequelize.STRING(50),
    allowNull: true,
  },

  photo: {
    type: Sequelize.ENUM("Complete", "Not Complete"),
    allowNull: true,
  },

  charityInformation: {
    type: Sequelize.ENUM("Complete", "Not Complete"),
    allowNull: true,
  },

  sitePlan: {
    type: Sequelize.ENUM("Complete", "Not Complete"),
    allowNull: true,
  },

  insurance: {
    type: Sequelize.ENUM("Complete", "Not Complete"),
    allowNull: true,
  },

  ownerConsent: {
    type: Sequelize.ENUM("Complete", "Not Complete"),
    allowNull: true,
  },
});

module.exports = Operator;
