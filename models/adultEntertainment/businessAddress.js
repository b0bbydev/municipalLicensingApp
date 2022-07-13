// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");
const Business = require("../dogtags/owner");

const BusinessAddress = sequelize.define("businessAddress", {
  businessAddressID: {
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

// create relationship with business table.
Business.hasMany(BusinessAddress, {
  foreignKey: "businessID",
});

module.exports = BusinessAddress;
