// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");
const Policy = require("./policy");

const Division = sequelize.define("division", {
  divisionID: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  divisionName: {
    type: Sequelize.STRING(40),
    allowNull: true,
  },
});

Policy.hasMany(Division, {
  foreignKey: "policyID",
});

module.exports = Division;
