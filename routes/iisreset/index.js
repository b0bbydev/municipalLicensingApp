var express = require("express");
var router = express.Router();
const DonationBin = require("../../models/donationBin/donationBin");

/* GET /iisreset */
router.get("/", async (req, res, next) => {
  // check if there's an error message in the session
  let messages = req.session.messages || [];
  // clear session messages
  req.session.messages = [];

  DonationBin.findAndCountAll({
    where: {
      iisreset: req.body.iisreset,
    },
  }).then((result) => {
    return res.render("iisreset/index", {
      title: "BWG | Reset",
      messages: messages,
      email: req.session.email,
      auth: req.session.auth, // authorization.
    });
  });
});

module.exports = router;
