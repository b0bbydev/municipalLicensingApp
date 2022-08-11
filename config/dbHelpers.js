// include db/connection pool.
const pool = require("./db");

let db = {};

/* general helpers. */
db.getDogNameFromDogID = (dogID) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT dogName FROM dogs WHERE dogID = ?",
      [dogID],
      (error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve(result);
      }
    );
  });
};

db.getAddressHistory = (ownerID) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT *, YEAR(lastModified) as year FROM addresshistory WHERE ownerID = ? ORDER BY lastModified DESC",
      [ownerID],
      (error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve(result);
      }
    );
  });
};

db.getDogHistory = (ownerID) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT *, YEAR(lastModified) as year FROM doghistory WHERE ownerID = ? ORDER BY lastModified DESC",
      [ownerID],
      (error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve(result);
      }
    );
  });
};

db.getTagNumberHistory = (dogID) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT *, YEAR(lastModified) as year FROM tagNumberHistory WHERE dogID = ? ORDER BY lastModified DESC",
      [dogID],
      (error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve(result);
      }
    );
  });
};

db.getActiveUsers = () => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT data FROM sessions", (error, result) => {
      if (error) {
        return reject(error);
      }
      return resolve(result);
    });
  });
};

module.exports = db;
