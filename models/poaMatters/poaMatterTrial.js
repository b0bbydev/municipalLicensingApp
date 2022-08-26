// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");
const POAMatter = require("./poaMatter");

const POAMatterTrial = sequelize.define("poaMatterTrial", {
  poaMatterTrialID: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  trialDate: {
    type: Sequelize.DATEONLY,
    allowNull: true,
  },

  trialComment: {
    type: Sequelize.STRING(255),
    allowNull: true,
  },
});

POAMatter.hasMany(POAMatterTrial, {
  foreignKey: "poaMatterID",
});

module.exports = POAMatterTrial;
