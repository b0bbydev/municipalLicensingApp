// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");
const KennelPropertyOwner = require("./kennelPropertyOwner");
const KennelPropertyOwnerAddress = require("./kennelPropertyOwnerAddress");

const KennelPropertyOwnerAddressHistory = sequelize.define(
  "kennelPropertyOwnerAddressHistory",
  {
    kennelPropertyOwnerAddressHistoryID: {
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

KennelPropertyOwner.hasMany(KennelPropertyOwnerAddressHistory, {
  foreignKey: "kennelPropertyOwnerID",
});

KennelPropertyOwnerAddress.hasMany(KennelPropertyOwnerAddressHistory, {
  foreignKey: "kennelPropertyOwnerAddressID",
});

module.exports = KennelPropertyOwnerAddressHistory;
