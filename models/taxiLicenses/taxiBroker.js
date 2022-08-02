// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");

const TaxiBroker = sequelize.define("taxiBroker", {
  taxiBrokerID: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  ownerName: {
    type: Sequelize.STRING(50),
    allowNull: true,
  },

  companyName: {
    type: Sequelize.STRING(75),
    allowNull: true,
  },

  phoneNumber: {
    type: Sequelize.STRING(15),
    allowNull: true,
  },

  licenseNumber: {
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

  certificateOfInsurance: {
    type: Sequelize.ENUM("Yes", "No"),
    allowNull: true,
  },

  zoningApproval: {
    type: Sequelize.ENUM("Yes", "No"),
    allowNull: true,
  },

  notes: {
    type: Sequelize.STRING(255),
    allowNull: true,
  },
});

module.exports = TaxiBroker;
