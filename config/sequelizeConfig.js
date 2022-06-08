// dotenv.
require("dotenv").config();
// sequelize.
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.USER,
  process.env.PASSWORD,
  {
    host: process.env.HOST,
    dialect: process.env.DIALECT,
    timezone: process.env.TIMEZONE,
    define: {
      timestamps: false,
    },
  }
);

module.exports = sequelize;
