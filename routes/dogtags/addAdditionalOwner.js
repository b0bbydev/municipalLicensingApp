var express = require("express");
var router = express.Router();
// models.
const AdditionalOwner = require("../../models/dogtags/additionalOwner");
// express-validate.
const { body, validationResult } = require("express-validator");
// authHelper middleware.
const { redirectToLogin } = require("../../config/authHelpers");

/* GET addAdditionalOwner page. */
router.get("/", async (req, res, next) => {
  // check if there's an error message in the session
  let messages = req.session.messages || [];
  // clear session messages
  req.session.messages = [];

  return res.render("dogtags/addAdditionalOwner", {
    title: "BWG | Add Additional Owner",
    errorMessages: messages,
    email: req.session.email,
  });
});

/* POST addAdditionalOwner */
router.post(
  "/",
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
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // use built-in array() to convert Result object to array for custom error messages.
    var errorArray = errors.array();

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("dogtags/addAdditionalOwner", {
        title: "BWG | Additional Owner",
        message: errorArray[0].msg,
        // if the form submission is unsuccessful, save their values.
        formData: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          town: req.body.town,
          homePhone: req.body.homePhone,
          cellPhone: req.body.cellPhone,
          workPhone: req.body.workPhone,
          email: req.body.email,
        },
      });
    } else {
      // create additionalOwner.
      AdditionalOwner.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        town: req.body.town,
        homePhone: req.body.homePhone,
        cellPhone: req.body.cellPhone,
        workPhone: req.body.workPhone,
        email: req.body.email,
        ownerID: req.session.ownerID,
      })
        .then((results) => {
          // redirect back to owner page after success.
          return res.redirect("/dogtags/owner/" + req.session.ownerID);
        })
        .catch((err) => {
          return res.render("dogtags/addAdditionalOwner", {
            title: "BWG | Add Additional Owner",
            message: "Page Error! ",
          });
        });
    }
  }
);

module.exports = router;
