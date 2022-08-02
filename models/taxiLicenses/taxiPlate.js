// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");
const TaxiBroker = require("./taxiBroker");

const TaxiPlate = sequelize.define("taxiPlate", {
  taxiPlateID: {
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
    type: Sequelize.STRING(15),
    allowNull: true,
  },

  email: {
    type: Sequelize.STRING(15),
    allowNull: true,
  },

  townPlateNumber: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },

  vehicleYearMakeModel: {
    type: Sequelize.STRING(40),
    allowNull: true,
  },

  provincialPlate: {
    type: Sequelize.STRING(20),
    allowNull: true,
  },

  vin: {
    type: Sequelize.STRING(40),
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

  driversAbstract: {
    type: Sequelize.ENUM("Yes", "No"),
    allowNull: true,
  },

  photoID: {
    type: Sequelize.ENUM("Yes", "No"),
    allowNull: true,
  },

  safetyCertificate: {
    type: Sequelize.ENUM("Yes", "No"),
    allowNull: true,
  },

  byLawInspection: {
    type: Sequelize.ENUM("Yes", "No"),
    allowNull: true,
  },

  insurance: {
    type: Sequelize.ENUM("Yes", "No"),
    allowNull: true,
  },

  vehicleOwnership: {
    type: Sequelize.ENUM("Yes", "No"),
    allowNull: true,
  },

  notes: {
    type: Sequelize.STRING(255),
    allowNull: true,
  },
});

TaxiBroker.hasMany(TaxiPlate, {
  foreignKey: "taxiBrokerID",
});

module.exports = TaxiPlate;
