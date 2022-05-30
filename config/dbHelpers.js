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

db.getGetOwnerInfo = (ownerID) => {
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
      "SELECT * FROM dogs LEFT JOIN licenses ON dogs.ownerID = licenses.ownerID WHERE dogs.dogID = ? GROUP BY dogs.dogID",
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
      "SELECT formName FROM dropdownforms WHERE formID = ?",
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

db.getAllOwners = (offset) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM owners LEFT JOIN addresses ON owners.ownerID = addresses.ownerID LIMIT 50 OFFSET ?",
      [offset],
      (error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve(result);
      }
    );
  });
};

db.countOwners = () => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT COUNT(*) as count FROM owners LEFT JOIN addresses ON owners.ownerID = addresses.ownerID",
      (error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve(result[0]);
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

db.insertOwner = (
  firstName,
  lastName,
  homePhone,
  cellPhone,
  workPhone,
  email
) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO owners (firstName, lastName, homePhone, cellPhone, workPhone, email) VALUES (?, ?, ?, ?, ?, ?)",
      [firstName, lastName, homePhone, cellPhone, workPhone, email],
      (error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve(result);
      }
    );
  });
};

db.insertAddress = (
  address,
  poBoxAptRR,
  town,
  postalCode,
  firstName,
  lastName
) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO addresses (address, poBoxAptRR, town, postalCode, ownerID) VALUES (?, ?, ?, ?, (SELECT ownerID FROM owners WHERE firstName = ? AND lastName = ?))",
      [address, poBoxAptRR, town, postalCode, firstName, lastName],
      (error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve(result);
      }
    );
  });
};

db.updateOwner = (
  firstName,
  lastName,
  homePhone,
  cellPhone,
  workPhone,
  email,
  ownerID
) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "UPDATE owners SET firstName = ?, lastName = ?, homePhone = ?, cellPhone = ?, workPhone = ?, email = ? WHERE ownerID = ?",
      [firstName, lastName, homePhone, cellPhone, workPhone, email, ownerID],
      (error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve(result);
      }
    );
  });
};

db.updateAddress = (address, poBoxAptRR, town, postalCode, ownerID) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "UPDATE addresses SET address = ?, poBoxAptRR = ?, town = ?, postalCode = ? WHERE ownerID = ?",
      [address, poBoxAptRR, town, postalCode, parseInt(ownerID)],
      (error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve(result);
      }
    );
  });
};

db.insertDog = (
  tagNumber,
  dogName,
  breed,
  colour,
  dateOfBirth,
  gender,
  spade,
  designation,
  rabiesTagNumber,
  rabiesExpiry,
  vetOffice,
  ownerID
) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO dogs (tagNumber, dogName, breed, colour, dateOfBirth, gender, spade, designation, rabiesTagNumber, rabiesExpiry, vetOffice, ownerID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        tagNumber,
        dogName,
        breed,
        colour,
        dateOfBirth,
        gender,
        spade,
        designation,
        rabiesTagNumber,
        rabiesExpiry,
        vetOffice,
        ownerID,
      ],
      (error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve(result);
      }
    );
  });
};

db.insertLicense = (issueDate, expiryDate, ownerID, tagNumber, dogName) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "INSERT INTO licenses (issueDate, expiryDate, ownerID, dogID) VALUES (?, ?, ?, (SELECT dogID FROM dogs WHERE tagNumber = ? AND dogName = ?))",
      [issueDate, expiryDate, ownerID, tagNumber, dogName],
      (error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve(result);
      }
    );
  });
};

db.updateDog = (
  tagNumber,
  dogName,
  breed,
  colour,
  dateOfBirth,
  gender,
  spade,
  designation,
  rabiesTagNumber,
  rabiesExpiry,
  vetOffice,
  ownerID,
  dogID
) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "UPDATE dogs SET tagNumber = ?, dogName = ?, breed = ?, colour = ?, dateOfBirth = ?, gender = ?, spade = ?, designation = ?, rabiesTagNumber = ?, rabiesExpiry = ?, vetOffice = ?, ownerID = ? WHERE dogID = ?",
      [
        tagNumber,
        dogName,
        breed,
        colour,
        dateOfBirth,
        gender,
        spade,
        designation,
        rabiesTagNumber,
        rabiesExpiry,
        vetOffice,
        ownerID,
        dogID,
      ],
      (error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve(result);
      }
    );
  });
};

db.updateLicenses = (issueDate, expiryDate, dogID) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "UPDATE licenses SET issueDate = ?, expiryDate = ? WHERE dogID = ?",
      [issueDate, expiryDate, dogID],
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

db.filterTagNumber = (tagNumber) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM owners LEFT JOIN dogs ON owners.ownerID = dogs.ownerID LEFT JOIN addresses ON owners.ownerID = addresses.ownerID WHERE tagNumber = ?",
      [tagNumber],
      (error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve(result);
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
