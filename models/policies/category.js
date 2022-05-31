// sequelize.
const Sequelize = require("sequelize");
// db.
const sequelize = require("../../config/sequelizeConfig");
const Policy = require("./policy");

const Category = sequelize.define("category", {
  categoryID: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  categoryName: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

Policy.hasMany(Category, {
  foreignKey: "policyID",
});

module.exports = Category;
