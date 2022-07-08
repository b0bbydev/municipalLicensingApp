var express = require("express");
var router = express.Router();
// models.
var User = require("../../models/admin/user");
// pagination lib.
const paginate = require("express-paginate");

/* GET /admin page. */
router.get("/", async (req, res, next) => {
  // check if there's an error message in the session
  let messages = req.session.messages || [];
  // clear session messages
  req.session.messages = [];

  // get Users.
  User.findAndCountAll({
    limit: req.query.limit,
    offset: req.skip,
  }).then((results) => {
    // for pagination.
    const itemCount = results.count;
    const pageCount = Math.ceil(results.count / req.query.limit);

    return res.render("admin/index", {
      title: "BWG | Admin Panel",
      errorMessages: messages,
      email: req.session.email,
      auth: req.session.auth.authLevel, // authorization.
      data: results.rows,
      pageCount,
      itemCount,
      queryCount: "Records returned: " + results.count,
      pages: paginate.getArrayPages(req)(5, pageCount, req.query.page),
      prev: paginate.href(req)(true),
      hasMorePages: paginate.hasNextPages(req)(pageCount),
    });
  });
});

/* POST /admin page */
router.post("/", async (req, res, next) => {
  // shouldn't need validation as there is technically no user input.
  User.update(
    {
      authLevel: req.body.authLevel,
    },
    {
      where: {
        email: req.body.email,
      },
    }
  )
    .then(res.redirect("/admin"))
    .catch((err) => {
      return res.render("admin/index", {
        title: "BWG | Admin Panel",
        message: "Page Error!",
      });
    });
});

module.exports = router;