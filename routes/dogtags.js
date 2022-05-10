var express = require("express");
var router = express.Router();
// authHelper.
const { redirectToLogin } = require("../config/authHelpers");
// db config.
var db = require("../config/db");
// dbHelpers.
var dbHelpers = require("../config/dbHelpers");
const paginate = require("express-paginate");
// express-validate.
const { body, validationResult } = require("express-validator");

/* GET dogtag page. */
router.get("/", async (req, res, next) => {
  // check if there's an error message in the session
  let messages = req.session.messages || [];

  // clear session messages
  req.session.messages = [];

  // create pagination query.
  var pagQuery =
    "SELECT * FROM owners LEFT JOIN dogs ON owners.ownerID = dogs.ownerID LEFT JOIN addresses ON owners.ownerID = addresses.ownerID LEFT JOIN licenses ON owners.ownerID = licenses.ownerID LIMIT 50 OFFSET ?";

  // get total count of records
  var count = await dbHelpers.countOwnersAndDogs();
  const pageCount = Math.ceil(count.count / 50);

  // call query on database, passing in the skip(offset) from req.query.skip.
  db.query(pagQuery, [parseInt(req.query.skip) || 0], function (err, data) {
    if (err) {
      console.log("Error: ", err);
    }

    res.render("dogtags", {
      title: "BWG | Dog Tags",
      errorMessages: messages,
      isAdmin: req.session.isAdmin,
      email: req.session.email,
      data: data,
      hasPrev: paginate.hasPreviousPages,
      hasNext: paginate.hasNextPages(req)(req.query.page),
      pages: paginate.getArrayPages(req)(pageCount, pageCount, req.query.page),
    });
  });
});

/* POST dogtag page */ /* note the middleware from express-validate. */
router.post(
  "/",
  body("filterCategory").exists().notEmpty(),
  body("filterValue")
    .exists()
    .notEmpty()
    // blacklist of characters that are NOT allowed.
    .matches(/^[^'";=_()*&%$#!<>\^]*$/),
  function (req, res, next) {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      res.render("dogtags", {
        title: "BWG | Dog Tags",
        message: "Filtering Error!",
        isAdmin: req.session.isAdmin,
        email: req.session.email,
      });
    } else {
      // only filtering by filterCategory & filterValue.
      if (!req.body.issueYear && !req.body.issueMonth) {
        // get filterCategory from form.
        var filterCategory = req.body.filterCategory;

        // require a switch for dogID because the SQL query doesn't know where dogID column is. (have to specify: dogs.dogID)
        switch (filterCategory) {
          case "dogID":
            filterCategory = "dogs.dogID";
        }

        // make the query.
        var query =
          "SELECT * FROM owners LEFT JOIN dogs ON owners.ownerID = dogs.ownerID LEFT JOIN addresses ON owners.ownerID = addresses.ownerID LEFT JOIN licenses ON owners.ownerID = licenses.ownerID WHERE " +
          filterCategory +
          " = ?";

        // call query on database; get filterValue from form.
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
      } else {
        // start logic for handling filtering by date.
        // for query with only year.
        if (req.body.issueYear && !req.body.issueMonth) {
          // get values from form.
          var filterCategory = req.body.filterCategory;
          var issueYear = req.body.issueYear;

          var query =
            "SELECT * FROM owners LEFT JOIN dogs ON owners.ownerID = dogs.ownerID LEFT JOIN addresses ON owners.ownerID = addresses.ownerID LEFT JOIN licenses ON owners.ownerID = licenses.ownerID WHERE " +
            filterCategory +
            " = ?" +
            " AND issueDate LIKE '?%'";

          // call query on database; get filterValue from form.
          db.query(
            query,
            [req.body.filterValue, parseInt(issueYear)],
            function (err, data) {
              if (err) {
                console.log("Error: ", err);
              }

              res.render("dogtags", {
                title: "BWG | Dogtags",
                isAdmin: req.session.isAdmin,
                email: req.session.email,
                data: data,
              });
            }
          );
          // for query with only month.
        } else if (!req.body.issueYear && req.body.issueMonth) {
          // get values from form.
          var filterCategory = req.body.filterCategory;
          var issueMonth = req.body.issueMonth;

          var query =
            "SELECT * FROM owners LEFT JOIN dogs ON owners.ownerID = dogs.ownerID LEFT JOIN addresses ON owners.ownerID = addresses.ownerID LEFT JOIN licenses ON owners.ownerID = licenses.ownerID WHERE " +
            filterCategory +
            " = ?" +
            " AND issueDate LIKE '%-" +
            issueMonth +
            "-%'";

          // call query on database; get filterValue from form.
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
          // for query with year AND month.
        } else if (req.body.issueYear && req.body.issueMonth) {
          // get values from form.
          var filterCategory = req.body.filterCategory;
          var issueYear = req.body.issueYear;
          var issueMonth = req.body.issueMonth;

          var query =
            "SELECT * FROM owners LEFT JOIN dogs ON owners.ownerID = dogs.ownerID LEFT JOIN addresses ON owners.ownerID = addresses.ownerID LEFT JOIN licenses ON owners.ownerID = licenses.ownerID WHERE " +
            filterCategory +
            " = ?" +
            " AND issueDate LIKE '" +
            issueYear +
            "-" +
            issueMonth +
            "-%'";

          // call query on database; get filterValue from form.
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
        }
      }
    }
  }
);

module.exports = router;
