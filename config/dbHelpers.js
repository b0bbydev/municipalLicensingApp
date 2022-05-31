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

db.getAllFromDropdown = (formID) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM dropdown WHERE formID = ?",
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

db.insertIntoDropdown = (value, formID) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO dropdown (value, formID) VALUES (?, ?)",
      [value, formID],
      (error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve(result);
      }
    );
  });
};

db.enableDropdownOption = (dropdownID) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "UPDATE dropdown SET isDisabled = 0 WHERE dropdownID = ?",
      [dropdownID],
      (error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve(result);
      }
    );
  });
};

db.disableDropdownOption = (dropdownID) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "UPDATE dropdown SET isDisabled = 1 WHERE dropdownID = ?",
      [dropdownID],
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

db.getAllForms = () => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM dropdownforms", (error, result) => {
      if (error) {
        return reject(error);
      }
      return resolve(result);
    });
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

db.filterCategoryAndValue = (filterCategory, filterValue) => {
  switch (filterCategory) {
    case "First Name":
      filterCategory = "firstName";
      break;
    case "Last Name":
      filterCategory = "lastName";
      break;
    case "Email":
      filterCategory = "email";
      break;
  }
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM owners LEFT JOIN addresses ON owners.ownerID = addresses.ownerID WHERE " +
        filterCategory +
        " LIKE ?",
      [filterValue + "%"],
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      }
    );
  });
};

/* general helpers */
/* Policies & Procedures */
db.getAllPolicies = () => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM policies", (error, result) => {
      if (error) {
        return reject(error);
      }
      return resolve(result);
    });
  });
};

db.policiesFilterCategoryAndValue = (filterCategory, filterValue) => {
  switch (filterCategory) {
    case "Policy ID":
      filterCategory = "policyID";
      break;
  }
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM policies WHERE " + filterCategory + " = ?",
      [filterValue],
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      }
    );
  });
};

module.exports = db;
