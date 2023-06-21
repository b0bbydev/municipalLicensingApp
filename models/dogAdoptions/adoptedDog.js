// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");

const AdoptedDog = sequelize.define("adoptedDog", {
  adoptedDogID: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  dogName: {
    type: Sequelize.STRING(25),
    allowNull: true,
  },

  dateOfAdoption: {
    type: Sequelize.DATEONLY,
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

  notes: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

module.exports = AdoptedDog;
