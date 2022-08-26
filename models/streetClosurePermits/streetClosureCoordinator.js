// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");
const StreetClosurePermit = require("./streetClosurePermit");

const StreetClosureCoordinator = sequelize.define("streetClosureCoordinator", {
  streetClosureCoordinatorID: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  coordinatorName: {
    type: Sequelize.STRING(50),
    allowNull: true,
  },

  coordinatorPhone: {
    type: Sequelize.STRING(20),
    allowNull: true,
  },

  coordinatorEmail: {
    type: Sequelize.STRING(50),
    allowNull: true,
  },
});

StreetClosurePermit.hasMany(StreetClosureCoordinator, {
  foreignKey: "streetClosurePermitID",
});

module.exports = StreetClosureCoordinator;
