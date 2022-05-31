// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../config/dbConfig");
const Dog = require("../models/dog");

const License = sequelize.define("license", {
  licenseID: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  issueDate: {
    type: Sequelize.DATE,
    allowNull: true,
  },

  expiryDate: {
    type: Sequelize.DATE,
    allowNull: true,
  },
});

// create relationship with dogs table.
Dog.hasMany(License, {
  foreignKey: "dogID",
});

module.exports = License;
