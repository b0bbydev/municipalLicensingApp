// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");
const User = require("./user");

const Role = sequelize.define("role", {
  roleID: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  roleName: {
    type: Sequelize.STRING(30),
    allowNull: true,
  },
});

// create relationship with owners table.
User.hasMany(Role, {
  foreignKey: "userID",
});

module.exports = Role;
