// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");

const Role = sequelize.define("role", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  roleName: {
    type: Sequelize.STRING(25),
    allowNull: true,
  },
});

module.exports = Role;
