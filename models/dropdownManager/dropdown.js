// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");
const DropdownForm = require("./dropdownForm");

const Dropdown = sequelize.define("dropdown", {
  dropdownID: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  value: {
    type: Sequelize.STRING,
    allowNull: true,
  },

  isDisabled: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
});

// create relationship with dropdownForms table.
DropdownForm.hasMany(Dropdown, {
  foreignKey: "dropdownFormID",
});

module.exports = Dropdown;
