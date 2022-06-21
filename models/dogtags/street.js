// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");

const Street = sequelize.define("street", {
  streetID: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  streetName: {
    type: Sequelize.STRING(50),
    allowNull: true,
  },
});

module.exports = Street;
