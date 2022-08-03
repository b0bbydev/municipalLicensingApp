module.exports = {
  camelize: function (str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
      if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
      return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });
  },

  fixEmptyValue: function (str) {
    if (str === " " || str === "") {
      str = null;
    }
    return str;
  },

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
      case "Auguest":
        return "8";
      case "September":
        return "9";
      case "October":
        return "10";
      case "Novemeber":
        return "11";
      case "December":
        return "12";
    }
  },

  areObjectsEqual: function (object1, object2) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (let key of keys1) {
      if (object1[key] !== object2[key]) {
        return false;
      }
    }
    return true;
  },
};
