// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");

const Kennel = sequelize.define("kennel", {
  kennelID: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  kennelName: {
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

  phoneNumber: {
    type: Sequelize.STRING(20),
    allowNull: true,
  },

  email: {
    type: Sequelize.STRING(50),
    allowNull: true,
  },

  notes: {
    type: Sequelize.STRING(255),
    allowNull: true,
  },

  policeCheck: {
    type: Sequelize.ENUM("Yes", "No"),
    allowNull: true,
  },

  photoID: {
    type: Sequelize.ENUM("Yes", "No"),
    allowNull: true,
  },

  zoningClearance: {
    type: Sequelize.ENUM("Yes", "No"),
    allowNull: true,
  },

  acoInspection: {
    type: Sequelize.ENUM("Yes", "No"),
    allowNull: true,
  },
});

module.exports = Kennel;
