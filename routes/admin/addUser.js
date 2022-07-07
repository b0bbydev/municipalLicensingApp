var express = require("express");
var router = express.Router();
// authHelper middleware.
const { adminAuth, isLoggedIn } = require("../../config/authHelpers");

/* GET admin/addUser page. */
router.get("/", async (req, res, next) => {
  // check if there's an error message in the session
  let messages = req.session.messages || [];
  // clear session messages
  req.session.messages = [];

  return res.render("admin/addUser", {
    title: "BWG | Admin Panel",
    errorMessages: messages,
    email: req.session.email,
    admin: req.session.admin, // authorization.
  });
});

module.exports = router;
