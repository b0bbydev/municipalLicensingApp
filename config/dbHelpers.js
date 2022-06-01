// include db/connection pool.
const pool = require("./db");

let db = {};

/* general helpers. */
/* Dog Licenses */
db.getNameFromOwnerID = (ownerID) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT firstName, lastName FROM owners WHERE ownerID = ?",
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

db.getOwnerInfo = (ownerID) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM owners LEFT JOIN addresses on owners.ownerID = addresses.ownerID WHERE owners.ownerID = ?",
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

db.getDogInfo = (dogID) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM dogs LEFT JOIN licenses ON dogs.dogID = licenses.dogID WHERE dogs.dogID = ? GROUP BY dogs.dogID",
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

db.getFormNameFromFormID = (formID) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT formName FROM dropdownforms WHERE dropdownFormID = ?",
      [formID],
      (error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve(result);
      }
    );
  });
};

db.getOwnerDogs = (ownerID) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM dogs INNER JOIN licenses ON dogs.dogID = licenses.dogID WHERE dogs.ownerID = ?",
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

db.getAddressHistory = (ownerID) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM addresshistory WHERE ownerID = ?",
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
      "SELECT * FROM doghistory WHERE ownerID = ? ORDER BY lastModified DESC",
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

module.exports = db;
