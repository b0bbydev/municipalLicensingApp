// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");

const Owner = sequelize.define("owner", {
  ownerID: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  firstName: {
    type: Sequelize.STRING,
    allowNull: true,
  },

  lastName: {
    type: Sequelize.STRING,
    allowNull: true,
  },

  homePhone: {
    type: Sequelize.STRING,
    allowNull: true,
  },

  homePhone: {
    type: Sequelize.STRING,
    allowNull: true,
  },

  cellPhone: {
    type: Sequelize.STRING,
    allowNull: true,
  },

  workPhone: {
    type: Sequelize.STRING,
    allowNull: true,
  },

  email: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

module.exports = Owner;
