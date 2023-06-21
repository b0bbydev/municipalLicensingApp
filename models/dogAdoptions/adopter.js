// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");
const AdoptedDog = require("./adoptedDog");

const Adopter = sequelize.define("adopter", {
  adopterID: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  firstName: {
    type: Sequelize.STRING(25),
    allowNull: true,
  },

  lastName: {
    type: Sequelize.STRING(25),
    allowNull: true,
  },

  phoneNumber: {
    type: Sequelize.STRING(15),
    allowNull: true,
  },

  email: {
    type: Sequelize.STRING(50),
    allowNull: true,
  },
});

// create relationship with adopters table.
AdoptedDog.hasMany(Adopter, {
  foreignKey: "adoptedDogID",
});

module.exports = Adopter;
