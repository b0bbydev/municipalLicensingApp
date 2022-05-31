// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../config/dbConfig");
const Owner = require("../models/owner");

const Address = sequelize.define("address", {
  addressID: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  address: {
    type: Sequelize.STRING,
    allowNull: true,
  },

  poBoxAptRR: {
    type: Sequelize.STRING,
    allowNull: true,
  },

  town: {
    type: Sequelize.STRING,
    allowNull: true,
  },

  postalCode: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

// create relationship with owners table.
Owner.hasMany(Address, {
  foreignKey: "ownerID",
});

module.exports = Address;
