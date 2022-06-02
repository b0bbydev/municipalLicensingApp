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
    type: Sequelize.STRING(25),
    allowNull: true,
  },

  lastName: {
    type: Sequelize.STRING(25),
    allowNull: true,
  },

  homePhone: {
    type: Sequelize.STRING(15),
    allowNull: true,
  },

  cellPhone: {
    type: Sequelize.STRING(15),
    allowNull: true,
  },

  workPhone: {
    type: Sequelize.STRING(15),
    allowNull: true,
  },

  email: {
    type: Sequelize.STRING(50),
    allowNull: true,
  },
});

module.exports = Owner;
