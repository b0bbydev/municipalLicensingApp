// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");
const Adopter = require("./adopter");

const AdopterAddress = sequelize.define("adopterAddress", {
  adopterAddressID: {
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

// create relationship with adopters table.
Adopter.hasMany(AdopterAddress, {
  as: "addresses",
  foreignKey: "adopterID",
});

module.exports = AdopterAddress;
