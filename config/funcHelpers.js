module.exports = {
  camelize: function (str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
      if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
      return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });
  },

  fixDate: function (str) {
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
};
