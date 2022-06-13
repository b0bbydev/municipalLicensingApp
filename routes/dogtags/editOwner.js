var express = require("express");
var router = express.Router();
// models.
const Owner = require("../../models/dogtags/owner");
const Address = require("../../models/dogtags/address");
// dbHelpers.
var dbHelpers = require("../../config/dbHelpers");
// express-validate.
const { body, param, validationResult } = require("express-validator");

/* GET /editOwner page */
router.get(
  "/:id",
  param("id").matches(/^\d+$/).trim(), // ensure only a number is passed into the params.
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...),
    if (!errors.isEmpty()) {
      return res.render("dogtags", {
        title: "BWG | Owner",
        message: "Error!",
        email: req.session.email,
      });
    } else {
      // check if there's an error message in the session,
      let messages = req.session.messages || [];
      // clear session messages,
      req.session.messages = [];

      // send ownerID to session; should be safe to do so here after validation.
      req.session.ownerID = req.params.id;

      // get owner information.
      var ownerInfo = await dbHelpers.getOwnerInfo(req.session.ownerID);

      return res.render("dogtags/editOwner", {
        title: "BWG | Edit Owner",
        errorMessages: messages,
        email: req.session.email,
        ownerID: req.session.ownerID,
        ownerInfo: {
          firstName: ownerInfo[0].firstName,
          lastName: ownerInfo[0].lastName,
          homePhone: ownerInfo[0].homePhone,
          cellPhone: ownerInfo[0].cellPhone,
          workPhone: ownerInfo[0].workPhone,
          email: ownerInfo[0].email,
          streetNumber: ownerInfo[0].streetNumber,
          streetName: ownerInfo[0].streetName,
          poBoxAptRR: ownerInfo[0].poBoxAptRR,
          town: ownerInfo[0].town,
          postalCode: ownerInfo[0].postalCode,
        },
      });
    }
  }
);

/* POST /editOwner */
router.post(
  "/:id",
  param("id").matches(/^\d+$/).trim(),
  body("firstName")
    .if(body("firstName").notEmpty())
    .matches(/^[a-zA-Z\'-]*$/)
    .withMessage("Invalid First Name Entry!")
    .trim(),
  body("lastName")
    .if(body("lastName").notEmpty())
    .matches(/^[a-zA-Z\'-]*$/)
    .withMessage("Invalid Last Name Entry!")
    .trim(),
  body("homePhone")
    .if(body("homePhone").notEmpty())
    .matches(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/)
    .withMessage("Invalid Home Phone Number Entry!")
    .trim(),
  body("cellPhone")
    .if(body("cellPhone").notEmpty())
    .matches(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/)
    .withMessage("Invalid Cell Phone Number Entry!")
    .trim(),
  body("workPhone")
    .if(body("workPhone").notEmpty())
    .matches(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/)
    .withMessage("Invalid Work Phone Number Entry!")
    .trim(),
  body("email")
    .if(body("email").notEmpty())
    .isEmail()
    .withMessage("Invalid Email Entry!")
    .trim(),
  body("streetNumber")
    .if(body("address").notEmpty())
    .matches(/^[0-9. ]*$/)
    .withMessage("Invalid Street Number Entry!")
    .trim(),
  body("streetName")
    .if(body("address").notEmpty())
    .matches(/^[a-zA-z. ]*$/)
    .withMessage("Invalid Street Name Entry!")
    .trim(),
  body("poBoxAptRR")
    .if(body("poBoxAptRR").notEmpty())
    .matches(/^[a-zA-z0-9. ]*$/)
    .withMessage("Invalid PO Box/Apt/RR Entry!")
    .trim(),
  body("town")
    .if(body("town").notEmpty())
    .matches(/^[a-zA-z, ]*$/)
    .withMessage("Invalid Town Entry!")
    .trim(),
  body("postalCode")
    .if(body("postalCode").notEmpty())
    .matches(/^[a-zA-z0-9- ]*$/)
    .withMessage("Invalid Postal Code Entry!")
    .trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // use built-in array() to convert Result object to array for custom error messages.
    var errorArray = errors.array();

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("dogtags/editOwner", {
        title: "BWG | Edit Owner",
        message: errorArray[0].msg,
        // if the form submission is unsuccessful, save their values.
        ownerInfo: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          homePhone: req.body.homePhone,
          cellPhone: req.body.cellPhone,
          workPhone: req.body.workPhone,
          email: req.body.email,
          streetNumber: req.body.streetNumber,
          streetName: req.body.streetName,
          poBoxAptRR: req.body.poBoxAptRR,
          town: req.body.town,
          postalCode: req.body.postalCode,
        },
      });
    } else {
      Owner.update(
        {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          homePhone: req.body.homePhone,
          cellPhone: req.body.cellPhone,
          workPhone: req.body.workPhone,
          email: req.body.email,
          addresses: [
            {
              streetNumber: req.body.streetNumber,
              streetName: req.body.streetName,
              poBoxAptRR: req.body.poBoxAptRR,
              town: req.body.town,
              postalCode: req.body.postalCode,
            },
          ],
        },
        {
          where: {
            ownerID: req.session.ownerID,
          },
        },
        {
          include: [Address],
        }
      ).catch((err) => {
        return res.render("dogtags/editOwner", {
          title: "BWG | Edit Owner",
          message: "Page Error! ",
        });
      });

      /* get owner information to compare with current request. */
      var ownerInfo = await dbHelpers.getOwnerInfo(req.session.ownerID);

      // if address fields are not the same. (i.e: if an address field is changed from current value in database).
      if (
        ownerInfo[0].streetNumber != req.body.streetNumber ||
        ownerInfo[0].streetName != req.body.streetName ||
        ownerInfo[0].poBoxAptRR != req.body.poBoxAptRR ||
        ownerInfo[0].town != req.body.town ||
        ownerInfo[0].postalCode != req.body.postalCode
      ) {
        Address.update(
          {
            streetNumber: req.body.streetNumber,
            streetName: req.body.streetName,
            poBoxAptRR: req.body.poBoxAptRR,
            town: req.body.town,
            postalCode: req.body.postalCode,
            ownerID: req.session.ownerID,
          },
          {
            where: {
              ownerID: req.session.ownerID,
            },
          }
        )
          .then((results) => {
            // redirect back to dogtag index after success.
            res.redirect("/dogtags");
          })
          .catch((err) => {
            return res.render("dogtags/editOwner", {
              title: "BWG | Edit Owner",
              message: "Page Error! ",
            });
          });
      }
    }
  }
);

module.exports = router;
