/* this file exports the database as an object (db) */

// include mysql.
const mysql = require("mysql");

// create connection to database.
// use createPool vs. createConnection - better for performance; reduces frequent opening & closing of connections.
let db = mysql.createPool({
  connectionLimit: process.env.CONNECTION_LIMIT,
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DB_PORT,
  dateStrings: process.env.DATE_STRINGS,
  multipleStatements: process.env.MULTIPLE_STATEMENTS,
});

// credentials for db.
module.exports = db;
