// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");

const StreetClosurePermit = sequelize.define("streetClosurePermit", {
  streetClosurePermitID: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  permitNumber: {
    type: Sequelize.STRING(15),
    allowNull: true,
  },

  issueDate: {
    type: Sequelize.DATEONLY,
    allowNull: true,
  },

  sponser: {
    type: Sequelize.STRING(50),
    allowNull: true,
  },

  coordinatorName: {
    type: Sequelize.STRING(50),
    allowNull: true,
  },

  coordinatorPhone: {
    type: Sequelize.STRING(20),
    allowNull: true,
  },

  coordinatorEmail: {
    type: Sequelize.STRING(50),
    allowNull: true,
  },

  everydayContactName: {
    type: Sequelize.STRING(50),
    allowNull: true,
  },

  everydayContactPhone: {
    type: Sequelize.STRING(20),
    allowNull: true,
  },

  everydayContactEmail: {
    type: Sequelize.STRING(50),
    allowNull: true,
  },

  closureLocation: {
    type: Sequelize.STRING(50),
    allowNull: true,
  },

  closureDate: {
    type: Sequelize.DATEONLY,
    allowNull: true,
  },

  closureTime: {
    type: Sequelize.STRING(50),
    allowNull: true,
  },

  description: {
    type: Sequelize.STRING(255),
    allowNull: true,
  },

  noiseExemption: {
    type: Sequelize.ENUM("Yes", "No"),
    allowNull: true,
  },

  alcoholServed: {
    type: Sequelize.ENUM("Yes", "No"),
    allowNull: true,
  },

  estimatedAttendance: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },

  cleanupPlan: {
    type: Sequelize.STRING(255),
    allowNull: true,
  },
});

module.exports = StreetClosurePermit;
