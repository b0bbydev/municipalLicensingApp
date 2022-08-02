// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");
const TaxiPlate = require("./taxiPlate");

const TaxiPlateOwnerAddress = sequelize.define("taxiPlateOwnerAddress", {
  taxiPlateOwnerAddressID: {
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

TaxiPlate.hasMany(TaxiPlateOwnerAddress, {
  foreignKey: "taxiPlateID",
});

module.exports = TaxiPlateOwnerAddress;
