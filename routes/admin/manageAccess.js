var express = require("express");
var router = express.Router();
// models.
var User = require("../../models/admin/user");
var Role = require("../../models/admin/role");

/* GET /admin/manageAccess page. */
router.get("/:id", async (req, res, next) => {
  // check if there's an error message in the session.
  let messages = req.session.messages || [];
  // clear session messages.
  req.session.messages = [];

  // user roles.
  User.findAll({
    include: [
      {
        model: Role,
        attributes: ["roleName"],
        through: { where: { userId: req.params.id } },
      },
    ],
    where: {
      id: req.params.id,
    },
  }).then((results) => {
    return res.render("admin/manageAccess", {
      title: "BWG | Manage Access",
      errorMessages: messages,
      email: req.session.email,
      auth: req.session.auth, // authorization.
      data: results,
    });
  });
});

module.exports = router;
