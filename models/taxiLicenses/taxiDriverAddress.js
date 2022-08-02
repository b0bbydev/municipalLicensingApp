// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");
const TaxiDriver = require("./taxiDriver");

const TaxiDriverAddress = sequelize.define("taxiDriverAddress", {
  taxiDriverAddressID: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  streetNumber: {
    type: Sequelize.INTEGER(10),
    allowNull: true,
  },

  streetName: {
    type: Sequelize.STRING(50),
    allowNull: true,
  },

  town: {
    type: Sequelize.STRING(30),
    allowNull: true,
  },

  postalCode: {
    type: Sequelize.STRING(15),
    allowNull: true,
  },
});

TaxiDriver.hasMany(TaxiDriverAddress, {
  foreignKey: "taxiDriverID",
});

module.exports = TaxiDriverAddress;
