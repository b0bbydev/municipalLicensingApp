// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");
const Policy = require("./policy");

const Authority = sequelize.define("authority", {
  authorityID: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  authorityName: {
    type: Sequelize.STRING(30),
    allowNull: true,
  },
});

Policy.hasMany(Authority, {
  foreignKey: "policyID",
});

module.exports = Authority;
