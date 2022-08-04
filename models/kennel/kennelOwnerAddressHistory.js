// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");
const KennelOwner = require("./kennelOwner");
const KennelOwnerAddress = require("./kennelOwnerAddress");

const KennelOwnerAddressHistory = sequelize.define(
  "kennelOwnerAddressHistory",
  {
    kennelOwnerAddressHistoryID: {
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

KennelOwner.hasMany(KennelOwnerAddressHistory, {
  foreignKey: "kennelOwnerID",
});

KennelOwnerAddress.hasMany(KennelOwnerAddressHistory, {
  foreignKey: "kennelOwnerAddressID",
});

module.exports = KennelOwnerAddressHistory;
