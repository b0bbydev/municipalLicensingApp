// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");
const Kennel = require("./kennel");

const KennelAddress = sequelize.define("kennelAddress", {
  kennelAddressID: {
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

Kennel.hasMany(KennelAddress, {
  foreignKey: "kennelID",
});

module.exports = KennelAddress;
