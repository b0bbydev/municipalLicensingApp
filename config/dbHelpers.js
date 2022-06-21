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

db.getDogInfo = (dogID) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM dogs WHERE dogID = ?",
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

db.getPolicyInfo = (policyID) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM policies WHERE policyID = ?",
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

module.exports = db;
