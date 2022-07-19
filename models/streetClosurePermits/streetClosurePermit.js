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

  sponser: {
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

  coordinatorName: {
    type: Sequelize.STRING(50),
    allowNull: true,
  },

  coordinatorPhone: {
    type: Sequelize.STRING(20),
    allowNull: true,
  },

  everydayContact: {
    type: Sequelize.STRING(50),
    allowNull: true,
  },

  everydayPhone: {
    type: Sequelize.STRING(20),
    allowNull: true,
  },

  issueDate: {
    type: Sequelize.DATEONLY,
    allowNull: true,
  },

  permitNumber: {
    type: Sequelize.STRING(15),
    allowNull: true,
  },
});

module.exports = StreetClosurePermit;
