var express = require("express");
var router = express.Router();
// dbHelpers.
var dbHelpers = require("../../config/dbHelpers");

/* GET addLicense page. */
router.get("/", async (req, res, next) => {
  // check if there's an error message in the session
  let messages = req.session.messages || [];

  // clear session messages
  req.session.messages = [];

  res.render("dogtags/addLicense", {
    title: "BWG | Add Dogtag License",
    errorMessages: messages,
    email: req.session.email,
  });
});

/* POST addLicense */
router.post("/", async (req, res, next) => {
  // insert owner, address and dog information.
  dbHelpers.insertOwnerAndDogInfo(
    req.body.firstName,
    req.body.lastName,
    req.body.homePhone,
    req.body.cellPhone,
    req.body.workPhone,
    req.body.email,
    req.body.address,
    req.body.poBoxAptRR,
    req.body.town,
    req.body.postalCode
  );

  // redirect back to dogtag index after success.
  res.redirect("/dogtags");
});

module.exports = router;
