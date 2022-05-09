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
    "SELECT * FROM owners LEFT JOIN dogs ON owners.ownerID = dogs.ownerID LIMIT 50 OFFSET ?";

  var count = await dbHelpers.countOwnersAndDogs();
  const pageCount = Math.ceil(count.count / 50);

  db.query(pagQuery, [parseInt(req.query.offset) || 0], function (err, data) {
    if (err) {
      console.log("Error: ", err);
    }

    res.render("dogtags", {
      title: "BWG | Dog Tags",
      isAdmin: req.session.isAdmin,
      email: req.session.email,
      data: data,
      hasPrev: paginate.hasPreviousPages,
      hasNext: paginate.hasNextPages(req)(req.query.page),
      pages: paginate.getArrayPages(req)(pageCount, pageCount, req.query.page),
    });
  });
});

/* POST dogtag page */
router.post("/", function (req, res, next) {
  
  switch(req.body.filterCategory) {
    case "First Name":
      filterCategory = "firstName"
  }

  // make the query.
  var query = "SELECT * FROM owners LEFT JOIN licenses on owners.ownerID = licenses.ownerID LEFT JOIN dogs ON owners.ownerID = dogs.ownerID WHERE " + filterCategory + " = ?";

  db.query(query, [req.body.filterValue], function (err, data) {
    if (err) {
      console.log("Error: ", err);
    }

    res.render("dogtags", {
      title: "BWG | Dogtags",
      isAdmin: req.session.isAdmin,
      email: req.session.email,
      data: data,
    });
  });
});

module.exports = router;
