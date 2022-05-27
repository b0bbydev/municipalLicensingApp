/* this file contains sensitive information related to the database connection to create the sessionStore. */
module.exports = {
  connectionLimit: process.env.CONNECTION_LIMIT,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  host: process.env.HOST,
  port: process.env.DB_PORT,
};
