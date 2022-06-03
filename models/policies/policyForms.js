// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");
const Policy = require("./policy");

const PolicyForms = sequelize.define("policyForms", {
  policyFormID: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  formName: {
    type: Sequelize.STRING(40),
    allowNull: true,
  },
});

// create relationship with policies table.
Policy.hasMany(PolicyForms, {
  foreignKey: "policyID",
});

module.exports = PolicyForms;
