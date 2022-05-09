var express = require("express");
var router = express.Router();
// db config.
var db = require("../config/db");
// dbHelpers.
var dbHelpers = require("../config/dbHelpers");
const paginate = require("express-paginate");

/* GET dogtag page. */
router.get("/", async (req, res, next) => {
  // create pagination query.
  var pagQuery =
    "SELECT * FROM owners LEFT JOIN dogs ON owners.ownerID = dogs.ownerID LIMIT 25 OFFSET ?";

  var count = await dbHelpers.countOwnersAndDogs();
  const pageCount = Math.ceil(count.count / 25);

  db.query(pagQuery, [parseInt(req.query.offset) || 0], function (err, data) {
    if (err) {
      console.log("Error: ", err);
    }

    res.render("dogtags", {
      title: "BWG | Dog Tags",
      isAdmin: req.session.isAdmin,
      email: req.session.email,
      data: data,
      hasNext: paginate.hasNextPages(req)(req.query.page),
      pages: paginate.getArrayPages(req)(pageCount - 1, pageCount, req.query.page),
    });
  });
});

module.exports = router;
