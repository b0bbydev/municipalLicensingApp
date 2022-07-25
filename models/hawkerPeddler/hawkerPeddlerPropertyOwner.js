// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");
const HawkerPeddlerBusiness = require("./hawkerPeddlerBusiness");

const HawkerPeddlerPropertyOwner = sequelize.define(
  "hawkerPeddlerPropertyOwner",
  {
    hawkerPeddlerPropertyOwnerID: {
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
  }
);

HawkerPeddlerBusiness.hasMany(HawkerPeddlerPropertyOwner, {
  foreignKey: "hawkerPeddlerBusinessID",
});

module.exports = HawkerPeddlerPropertyOwner;
