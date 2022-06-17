// dotenv.
require("dotenv").config();
// sequelize.
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DATABASE,
  "bobby",
  process.env.PASSWORD,
  {
    host: process.env.HOST,
    dialect: process.env.DIALECT,
    timezone: process.env.TIMEZONE,
    define: {
      timestamps: false,
    },
    logging: console.log,
  }
);

module.exports = sequelize;
