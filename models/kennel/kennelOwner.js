// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");
const Kennel = require("./kennel");

const KennelOwner = sequelize.define("kennelowner", {
  kennelOwnerID: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  firstName: {
    type: Sequelize.STRING(50),
    allowNull: true,
  },

  lastName: {
    type: Sequelize.STRING(50),
    allowNull: true,
  },

  phoneNumber: {
    type: Sequelize.STRING(20),
    allowNull: true,
  },

  email: {
    type: Sequelize.STRING(50),
    allowNull: true,
  },

  licenseNumber: {
    type: Sequelize.STRING(50),
    allowNull: true,
  },
});

Kennel.hasMany(KennelOwner, {
  foreignKey: "kennelID",
});

module.exports = KennelOwner;
