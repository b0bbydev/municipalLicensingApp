// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");
const Owner = require("../dogtags/owner");

const Dog = sequelize.define("dog", {
  dogID: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  tagNumber: {
    type: Sequelize.STRING(25),
    allowNull: true,
  },

  dogName: {
    type: Sequelize.STRING(30),
    allowNull: true,
  },

  breed: {
    type: Sequelize.STRING(25),
    allowNull: true,
  },

  colour: {
    type: Sequelize.STRING(25),
    allowNull: true,
  },

  gender: {
    type: Sequelize.ENUM("M", "F"),
    allowNull: true,
  },

  dateOfBirth: {
    type: Sequelize.DATEONLY,
    allowNull: true,
  },

  designation: {
    type: Sequelize.STRING(20),
    allowNull: true,
  },

  spade: {
    type: Sequelize.STRING(20),
    allowNull: true,
  },

  rabiesTagNumber: {
    type: Sequelize.STRING(25),
    allowNull: true,
  },

  rabiesExpiry: {
    type: Sequelize.DATEONLY,
    allowNull: true,
  },

  vetOffice: {
    type: Sequelize.STRING(50),
    allowNull: true,
  },

  tagRequired: {
    type: Sequelize.STRING(30),
    allowNull: true,
  },

  issueDate: {
    type: Sequelize.DATEONLY,
    allowNull: true,
  },

  expiryDate: {
    type: Sequelize.DATEONLY,
    allowNull: true,
  },

  vendor: {
    type: Sequelize.STRING(30),
    allowNull: true,
  },

  notes: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

// create relationship with owners table.
Owner.hasMany(Dog, {
  foreignKey: "ownerID",
});

module.exports = Dog;
