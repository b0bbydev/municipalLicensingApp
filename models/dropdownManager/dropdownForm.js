// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");

const DropdownForm = sequelize.define("dropdownForms", {
  dropdownFormID: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  formName: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

module.exports = DropdownForm;
