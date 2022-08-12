module.exports = {
  // this function should camelize any word that is made up of 2 or more words.
  camelize: function (str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
      if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
      return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });
  },

  // will replace any value that is passed in as empty, blank or undefined to null.
  fixEmptyValue: function (str) {
    if (str === " " || str === "" || str === undefined) {
      str = null;
    }
    return str;
  },

  // convert the month to it's corresponding number for SQL queries.
  monthToNumber: function (str) {
    switch (str) {
      case "January":
        return "1";
      case "February":
        return "2";
      case "March":
        return "3";
      case "April":
        return "4";
      case "May":
        return "5";
      case "June":
        return "6";
      case "July":
        return "7";
      case "August":
        return "8";
      case "September":
        return "9";
      case "October":
        return "10";
      case "November":
        return "11";
      case "December":
        return "12";
    }
  },

  // function to compare to Object's properties to check if they are equal.
  // used to check if Object has changed before performing SQL query.
  areObjectsEqual: function (object1, object2) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);

    // if the object contains different amount of properties.
    if (keys1.length !== keys2.length) {
      return false;
    }

    // loop through properties to check if they match.
    for (let key of keys1) {
      if (object1[key] !== object2[key]) {
        return false;
      }
    }
    return true;
  },
};
