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

db.getPolicyHistory = (policyID) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT *, YEAR(lastModified) as year FROM policyHistory WHERE policyID = ? ORDER BY lastModified DESC",
      [policyID],
      (error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve(result);
      }
    );
  });
};

db.getProcedureHistory = (policyID) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT *, YEAR(lastModified) as year FROM procedureHistory WHERE policyID = ? ORDER BY lastModified DESC",
      [policyID],
      (error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve(result);
      }
    );
  });
};

db.getGuidelineHistory = (policyID) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT *, YEAR(lastModified) as year FROM guidelineHistory WHERE policyID = ? ORDER BY lastModified DESC",
      [policyID],
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

module.exports = db;
