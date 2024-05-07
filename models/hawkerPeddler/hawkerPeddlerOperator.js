// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");
const HawkerPeddlerBusiness = require("./hawkerPeddlerBusiness");

const HawkerPeddlerOperator = sequelize.define("HawkerPeddlerOperator", {
  hawkerPeddlerOperatorID: {
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
});

HawkerPeddlerBusiness.hasMany(HawkerPeddlerOperator, {
  foreignKey: "hawkerPeddlerBusinessID",
});

module.exports = HawkerPeddlerOperator;
