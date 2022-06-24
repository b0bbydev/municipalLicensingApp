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

db.getAdditionalOwnerInfo = (additionalOwnerID) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM additionalowners WHERE additionalOwnerID = ?",
      [additionalOwnerID],
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
      "SELECT * FROM dogs WHERE ownerID = ?",
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

db.getExpiredTags = () => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM owners LEFT JOIN addresses ON owners.ownerID = addresses.ownerID LEFT JOIN dogs ON owners.ownerID = dogs.ownerID WHERE dogs.expiryDate < NOW() GROUP BY owners.firstName ORDER BY owners.ownerID",
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
