// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");

const HawkerPeddlerBusiness = sequelize.define("hawkerPeddlerBusiness", {
  hawkerPeddlerBusinessID: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  businessName: {
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

  itemsForSale: {
    type: Sequelize.STRING(255),
    allowNull: true,
  },

  notes: {
    type: Sequelize.STRING(255),
    allowNull: true,
  },

  policeVSC: {
    type: Sequelize.ENUM("Yes", "No"),
    allowNull: true,
  },

  photoID: {
    type: Sequelize.ENUM("Yes", "No"),
    allowNull: true,
  },

  sitePlan: {
    type: Sequelize.ENUM("Yes", "No"),
    allowNull: true,
  },

  zoningClearance: {
    type: Sequelize.ENUM("Yes", "No"),
    allowNull: true,
  },
});

module.exports = HawkerPeddlerBusiness;
