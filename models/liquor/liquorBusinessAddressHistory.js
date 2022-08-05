// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");
const LiquorBusiness = require("./liquorBusiness");
const LiquorBusinessAddress = require("./liquorBusinessAddress");

const LiquorBusinessAddressHistory = sequelize.define(
  "liquorBusinessAddressHistory",
  {
    liquorBusinessAddressHistoryID: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },

    action: {
      type: Sequelize.STRING(20),
      allowNull: false,
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

    lastModified: {
      type: Sequelize.DATE,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
);

LiquorBusiness.hasMany(LiquorBusinessAddressHistory, {
  foreignKey: "liquorBusinessID",
});

LiquorBusinessAddress.hasMany(LiquorBusinessAddressHistory, {
  foreignKey: "liquorBusinessAddressID",
});

module.exports = LiquorBusinessAddressHistory;
