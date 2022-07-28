// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");

const POAMatter = sequelize.define("poaMatter", {
  poaMatterID: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  infoNumber: {
    type: Sequelize.STRING(20),
    allowNull: true,
  },

  dateOfOffence: {
    type: Sequelize.DATEONLY,
    allowNull: true,
  },

  dateClosed: {
    type: Sequelize.DATEONLY,
    allowNull: true,
  },

  defendantName: {
    type: Sequelize.STRING(50),
    allowNull: true,
  },

  poaType: {
    type: Sequelize.STRING(15),
    allowNull: true,
  },

  offence: {
    type: Sequelize.STRING(255),
    allowNull: true,
  },

  officerAssigned: {
    type: Sequelize.STRING(50),
    allowNull: true,
  },

  setFine: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },

  fineAssesed: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },

  amountPaid: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },

  prosecutor: {
    type: Sequelize.STRING(50),
    allowNull: true,
  },

  verdict: {
    type: Sequelize.STRING(25),
    allowNull: true,
  },

  comment: {
    type: Sequelize.STRING(255),
    allowNull: true,
  },
});

module.exports = POAMatter;
