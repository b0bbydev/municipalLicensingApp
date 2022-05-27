// dbHelpers.
var dbHelpers = require("../config/dbHelpers");
// pagination lib.
const paginate = require("express-paginate");

module.exports = {
  filterCategoryAndValue: async (filterCategory, filterValue, req, res) => {
    var data = await dbHelpers.filterCategoryAndValue(
      filterCategory,
      filterValue
    );

    // pagination - doesn't really work
    const pageCount = Math.ceil(data.length / 50);

    return res.render("dogtags", {
      title: "BWG | Dogtags",
      email: req.session.email,
      filterCategory: filterCategory,
      filterValue: filterValue,
      data: data,
      queryCount: "Records returned: " + data.length,
      pages: paginate.getArrayPages(req)(pageCount, pageCount, req.query.page),
    });
  },

  filterTagNumber: async (tagNumber, req, res) => {
    var data = await dbHelpers.filterTagNumber(tagNumber);

    // pagination - doesn't really work
    const pageCount = Math.ceil(data.length / 50);

    return res.render("dogtags", {
      title: "BWG | Dogtags",
      email: req.session.email,
      tagNumber: tagNumber,
      data: data,
      queryCount: "Records returned: " + data.length,
      pages: paginate.getArrayPages(req)(pageCount, pageCount, req.query.page),
    });
  },

  policiesFilterCategoryAndValue: async (
    filterCategory,
    filterValue,
    req,
    res
  ) => {
    // dbHelper method here.
    var data = await dbHelpers.policiesFilterCategoryAndValue(
      filterCategory,
      filterValue
    );

    // pagination - doesn't really work
    const pageCount = Math.ceil(data.length / 50);

    return res.render("policies", {
      title: "BWG | Policies",
      email: req.session.email,
      data: data,
      queryCount: "Records returned: " + data.length,
      pages: paginate.getArrayPages(req)(pageCount, pageCount, req.query.page),
    });
  },
}; // end of file.
