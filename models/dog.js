// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../config/sequelizeConfig");
const Owner = require("../models/owner");

const Dog = sequelize.define("dog", {
  dogID: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  tagNumber: {
    type: Sequelize.STRING,
    allowNull: true,
  },

  dogName: {
    type: Sequelize.STRING,
    allowNull: true,
  },

  breed: {
    type: Sequelize.STRING,
    allowNull: true,
  },

  colour: {
    type: Sequelize.STRING,
    allowNull: true,
  },

  gender: {
    type: Sequelize.ENUM("M", "F"),
    allowNull: true,
  },

  dateOfBirth: {
    type: Sequelize.DATE,
    allowNull: true,
  },

  designation: {
    type: Sequelize.STRING,
    allowNull: true,
  },

  spade: {
    type: Sequelize.STRING,
    allowNull: true,
  },

  rabiesTagNumber: {
    type: Sequelize.STRING,
    allowNull: true,
  },

  rabiesExpiry: {
    type: Sequelize.DATE,
    allowNull: true,
  },

  vetOffice: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

// create relationship with owners table.
Owner.hasMany(Dog, {
  foreignKey: "ownerID",
});

module.exports = Dog;
