module.exports = {
  camelize: function (str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
      if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
      return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });
  },

  fixDate: function (str) {
    if (str === null || str === "") {
      str = "0000-01-01";
    }
    return str;
  },
};
