// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");
const Owner = require("../dogtags/owner");

const Address = sequelize.define("address", {
  addressID: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  streetNumber: {
    type: Sequelize.INTEGER(10),
    allowNull: true,
  },

  poBoxAptRR: {
    type: Sequelize.STRING(25),
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

// create relationship with owners table.
Owner.hasMany(Address, {
  foreignKey: "ownerID",
});

module.exports = Address;
