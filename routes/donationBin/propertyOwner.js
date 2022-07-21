var express = require("express");
var router = express.Router();
// models.
var DonationBin = require("../../models/donationBin/donationBin");
var DonationBinOperator = require("../../models/donationBin/donationBinOperator");
// sequelize.
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
// pagination lib.
const paginate = require("express-paginate");

/* GET /donationBin/propertyOwner/:id */
router.get("/", async (req, res, next) => {
  // check if there's an error message in the session
  let messages = req.session.messages || [];
  // clear session messages
  req.session.messages = [];

  return res.render("donationBin/propertyOwner", {
    title: "BWG | Property Owner",
    errorMessages: messages,
    email: req.session.email,
    auth: req.session.auth, // authorization.
  });
});

/* POST /donationBin/propertyOwner/:id */
router.post("/", async (req, res, next) => {
  // server side validation.
  const errors = validationResult(req);

  // if errors is NOT empty (if there are errors...).
  if (!errors.isEmpty()) {
    return res.render("donationBin/propertyOwner", {
      title: "BWG | Property Owner",
      message: "Page Error!",
      email: req.session.email,
      auth: req.session.auth, // authorization.
    });
  } else {
    // get the specified policy based on name.
    DonationBinOperator.findOne({
      attributes: ["donationBinOperatorID"],
      where: Sequelize.where(
        Sequelize.fn(
          "concat",
          Sequelize.col("firstName"),
          " ", // have to include the whitespace between. i.e: JohnDoe != John Doe.
          Sequelize.col("lastName")
        ),
        {
          [Op.like]: "%" + req.body.operator + "%",
        }
      ),
    })
      .then((results) => {
        donationBinOperatorID = results.donationBinOperatorID;
      })
      .then(() => {
        DonationBin.update(
          {
            policyID: policyID,
          },
          {
            where: {
              guidelineID: req.body.guidelineID,
            },
          }
        );
      })
      .then(() => {
        res.redirect("/policies/guidelines");
      })
      .catch((err) =>
        res.render("policies/guidelines", {
          title: "BWG | Guidelines",
          message: "Page Error!",
        })
      );
  }
});

module.exports = router;
