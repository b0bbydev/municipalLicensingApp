// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");
const Dog = require("../dogtags/dog");

const License = sequelize.define("license", {
  licenseID: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  issueDate: {
    type: Sequelize.DATEONLY,
    allowNull: true,
  },

  expiryDate: {
    type: Sequelize.DATEONLY,
    allowNull: true,
  },
});

// create relationship with dogs table.
Dog.hasMany(License, {
  foreignKey: "dogID",
});

module.exports = License;
