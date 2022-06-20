// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");
const Address = require("../dogtags/address");

const Street = sequelize.define("street", {
  streetID: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  streetName: {
    type: Sequelize.STRING(50),
    allowNull: true,
  },
});

// create relationship with address table.
Address.hasMany(Street, {
  foreignKey: "addressID",
});

module.exports = Street;
