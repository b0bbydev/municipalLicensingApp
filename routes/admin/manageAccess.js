var express = require("express");
var router = express.Router();
// models.
const User = require("../../models/admin/user");
const Role = require("../../models/admin/role");
const UserRole = require("../../models/admin/userRole");
// sequelize.
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
// express-validate.
const { param, validationResult } = require("express-validator");

/* GET /admin/manageAccess */
router.get(
  "/:id",
  param("id").matches(/^\d+$/).trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("admin/index", {
        title: "BWG | Admin Panel",
        message: "Page Error!",
        auth: req.session.auth, // authorization.
      });
    } else {
      // check if there's an error message in the session.
      let messages = req.session.messages || [];
      // clear session messages.
      req.session.messages = [];

      // get all roles.
      var roles = await Role.findAll();

      // user roles.
      User.findAll({
        include: [
          {
            model: Role,
            attributes: ["id", "roleName"],
            through: { where: { userId: req.params.id } },
          },
        ],
        where: {
          id: req.params.id,
        },
      })
        .then((results) => {
          return res.render("admin/manageAccess", {
            title: "BWG | Manage Access",
            message: messages,
            email: req.session.email,
            auth: req.session.auth, // authorization.
            data: results,
            userId: req.params.id,
            userName: results[0].firstName + " " + results[0].lastName,
            roles: roles,
          });
        })
        .catch((err) => {
          return res.render("admin/manageAccess", {
            title: "BWG | Manage Access",
            message: "Page Error!",
            auth: req.session.auth, // authorization.
          });
        });
    }
  }
);

/* POST /admin/manageAccess */
router.post("/:id", async (req, res, next) => {
  // server side validation.
  const errors = validationResult(req);

  // if errors is NOT empty (if there are errors...)
  if (!errors.isEmpty()) {
    return res.render("admin/manageAccess", {
      title: "BWG | Manage Access",
      message: "Error!",
      email: req.session.email,
      auth: req.session.auth, // authorization.
    });
  } else {
    // create userRole.
    UserRole.create({
      userId: req.params.id,
      roleId: req.body.roleId,
    })
      .then(() => {
        return res.redirect(req.headers.referer);
      })
      .catch((err) => {
        return res.render("admin/manageAccess", {
          title: "BWG | Manage Access",
          message: "Page Error!",
          auth: req.session.auth, // authorization.
        });
      });
  }
});

/* REVOKE /admin/manageAccess/:id */
router.get("/:userId/revoke/:roleId", (req, res, next) => {
  // server side validation.
  const errors = validationResult(req);

  // if errors is NOT empty (if there are errors...)
  if (!errors.isEmpty()) {
    return res.render("admin/manageAccess", {
      title: "BWG | Manage Access",
      message: messages,
      email: req.session.email,
      auth: req.session.auth, // authorization.
    });
  } else {
    UserRole.destroy({
      where: {
        [Op.and]: [
          {
            userId: req.params.userId,
          },
          {
            roleId: req.params.roleId,
          },
        ],
      },
    })
      // redirect to same page.
      .then(() => {
        return res.redirect(req.headers.referer);
      })
      .catch((err) => {
        return res.render("admin/manageAccess", {
          title: "BWG | Manage Access",
          message: "Page Error!",
          auth: req.session.auth, // authorization.
        });
      });
  }
});

module.exports = router;
