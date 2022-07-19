var express = require("express");
var router = express.Router();
// models.
const StreetClosurePermit = require("../../models/streetClosurePermits/streetClosurePermit");
// pagination lib.
const paginate = require("express-paginate");

/* GET /streetClosurePermit */
router.get("/", function (req, res, next) {
  // check if there's an error message in the session
  let messages = req.session.messages || [];
  // clear session messages
  req.session.messages = [];

  // get street closure permits.
  StreetClosurePermit.findAndCountAll({
    limit: req.query.limit,
    offset: req.skip,
  })
    .then((results) => {
      // for pagination.
      const itemCount = results.count;
      const pageCount = Math.ceil(results.count / req.query.limit);
      return res.render("streetClosurePermit/index", {
        title: "BWG | Street Closure Permits",
        errorMessages: messages,
        email: req.session.email,
        auth: req.session.auth, // authorization.
        data: results.rows,
        pageCount,
        itemCount,
        queryCount: "Records returned: " + results.count,
        pages: paginate.getArrayPages(req)(5, pageCount, req.query.page),
        prev: paginate.href(req)(true),
        hasMorePages: paginate.hasNextPages(req)(pageCount),
      });
    })
    // catch any scary errors and render page error.
    .catch((err) =>
      res.render("streetClosurePermit/index", {
        title: "BWG | Street Closure Permits",
        message: "Page Error!",
      })
    );
});

module.exports = router;
