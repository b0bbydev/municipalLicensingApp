// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");
const StreetClosurePermit = require("./streetClosurePermit");

const StreetClosureContact = sequelize.define("streetClosureContact", {
  streetClosureContactID: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  everydayContactName: {
    type: Sequelize.STRING(50),
    allowNull: true,
  },

  everydayContactPhone: {
    type: Sequelize.STRING(20),
    allowNull: true,
  },

  everydayContactEmail: {
    type: Sequelize.STRING(50),
    allowNull: true,
  },
});

StreetClosurePermit.hasMany(StreetClosureContact, {
  foreignKey: "streetClosurePermitID",
});

module.exports = StreetClosureContact;
