var express = require("express");
var router = express.Router();
// models.
const DropdownForm = require("../../models/dropdownManager/dropdownForm");
// pagination lib.
const paginate = require("express-paginate");
// express-validate.
const { body, validationResult } = require("express-validator");

/* GET /dropdownManager */
router.get("/", async (req, res, next) => {
  // check if there's an error message in the session
  let messages = req.session.messages || [];
  // clear session messages
  req.session.messages = [];

  DropdownForm.findAndCountAll({
    limit: req.query.limit,
    offset: req.skip,
  })
    .then((results) => {
      // for pagination.
      const itemCount = results.count;
      const pageCount = Math.ceil(results.count / req.query.limit);

      return res.render("dropdownManager/index", {
        title: "BWG | Dropdown Manager",
        message: messages,
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
    .catch((err) => {
      return res.render("dropdownManager/index", {
        title: "BWG | Dropdown Manager",
        message: "Page Error!",
      });
    });
});

/* POST /dropdownManger */
router.post(
  "/",
  body("formName")
    .notEmpty()
    .matches(/^[^%<>^$\/\\;!{}?]+$/)
    .withMessage("Invalid Dropdown Form Name Entry!")
    .trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // use built-in array() to convert Result object to array for custom error messages.
    var errorArray = errors.array();

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("dropdownManager/index", {
        title: "BWG | Dropdown Manager",
        message: errorArray[0].msg, // custom error message. (should indicate which field has the error.)
        email: req.session.email,
        auth: req.session.auth, // authorization.
      });
    } else {
      // create dropdown form.
      DropdownForm.create({
        formName: req.body.formName,
      })
        .then(res.redirect("/dropdownManager"))
        .catch((err) => {
          return res.render("dropdownManager/index", {
            title: "BWG | Dropdown Manager",
            message: "Page Error!",
          });
        });
    }
  }
);

module.exports = router;
