var express = require("express");
var router = express.Router();
const { redirectToLogin } = require("../../config/authHelpers");
// dbHelpers.
var dbHelpers = require("../../config/dbHelpers");
// filterHelpers.
var filterHelpers = require("../../config/filterHelpers");
// pagination lib.
const paginate = require("express-paginate");
// express-validate.
const { body, param, query, validationResult } = require("express-validator");

/* GET dogtag page. */
router.get(
  "/",
  query("skip").if(query("skip").exists()).isNumeric(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("dogtags", {
        title: "BWG | Dogtags",
        message: "Page Error!",
      });
    } else {
      // check if there's an error message in the session
      let messages = req.session.messages || [];

      // clear session messages
      req.session.messages = [];

      // get total count of owners.
      var ownersCount = await dbHelpers.countOwners();
      const pageCount = Math.ceil(ownersCount.count / 50);

      // || 0 prevents the validation from triggering on initial page load.
      var data = await dbHelpers.getAllOwners(parseInt(req.query.skip) || 0);

      return res.render("dogtags", {
        title: "BWG | Dog Tags",
        errorMessages: messages,
        email: req.session.email,
        data: data,
        queryCount: "Records returned: " + data.length,
        pages: paginate.getArrayPages(req)(
          pageCount,
          pageCount,
          req.query.page
        ),
      });
    }
  }
);

/* POST dogtag page */
router.post(
  "/",
  // validate all input fields.
  body("filterCategory")
    .matches(/^[^'";=_()*&%$#!<>\/\^\\]*$/)
    .trim(),
  body("filterValue")
    .matches(/^[^'";=_()*&%$#!<>\/\^\\]*$/)
    .trim(),
  function (req, res, next) {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("dogtags", {
        title: "BWG | Dog Tags",
        message: "Filtering Error!",
        email: req.session.email,
      });
    } else {
      if (
        // ALL supplied filters.
        req.body.filterCategory &&
        req.body.filterValue
      ) {
        filterHelpers.filterCategoryAndValue(
          req.body.filterCategory,
          req.body.filterValue,
          req,
          res
        );
      } else if (
        // NO supplied filters.
        !req.body.filterCategory &&
        !req.body.filterValue
      ) {
        return res.render("dogtags", {
          title: "BWG | Dog Tags",
          message: "Please provide a value to filter by!",
          email: req.session.email,
        });
        // else something weird happens..
      } else {
        return res.render("dogtags", {
          title: "BWG | Dog Tags",
          message: "Please ensure both filtering conditions are valid!",
          email: req.session.email,
        });
      }
    }
  }
); // end of post.

/* GET owner page. */
router.get(
  "/owner/:id",
  param("id").matches(/^\d+$/).trim(), // ensure only a number is passed into the params.
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("dogtags", {
        title: "BWG | Owner",
        message: "Error!",
        email: req.session.email,
      });
    } else {
      // check if there's an error message in the session
      let messages = req.session.messages || [];

      // clear session messages
      req.session.messages = [];

      // send ownerID to session; should be safe to do so here after validation.
      req.session.ownerID = req.params.id;

      // dog data.
      var data = await dbHelpers.getOwnerDogs(req.session.ownerID);
      // get ownerName from custom query.
      var ownerName = await dbHelpers.getNameFromOwnerID(req.session.ownerID);

      // error handle here, if supplied ownerID isn't in database.
      if (ownerName[0]) {
        ownerName = ownerName[0].firstName + " " + ownerName[0].lastName;
      } else {
        return res.render("dogtags/owner", {
          title: "BWG | Owner",
          message: "Owner Lookup Error!",
          email: req.session.email,
        });
      }

      return res.render("dogtags/owner", {
        title: "BWG | Owner",
        errorMessages: messages,
        email: req.session.email,
        ownerName: ownerName,
        ownerID: req.session.ownerID,
        queryCount: "Dog(s) on record: " + data.length,
        data: data,
      });
    }
  }
);

/* GET /editOwner page */
router.get(
  "/editOwner/:id",
  param("id").matches(/^\d+$/).trim(), // ensure only a number is passed into the params.
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("dogtags", {
        title: "BWG | Owner",
        message: "Error!",
        email: req.session.email,
      });
    } else {
      // check if there's an error message in the session
      let messages = req.session.messages || [];

      // clear session messages
      req.session.messages = [];

      // send ownerID to session; should be safe to do so here after validation.
      req.session.ownerID = req.params.id;

      // get owner information by ID via custom query.
      var ownerInfo = await dbHelpers.getGetOwnerInfo(req.session.ownerID);

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
          address: ownerInfo[0].address,
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
  "/editOwner/:id",
  param("id").matches(/^\d+$/).trim(),
  body("firstName").if(body("firstName").notEmpty()).isAlpha().trim(),
  body("lastName").if(body("lastName").notEmpty()).isAlpha().trim(),
  body("homePhone")
    .if(body("homePhone").notEmpty())
    .matches(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/)
    .trim(),
  body("cellPhone")
    .if(body("cellPhone").notEmpty())
    .matches(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/)
    .trim(),
  body("workPhone")
    .if(body("workPhone").notEmpty())
    .matches(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/)
    .trim(),
  body("email").isEmail().trim(),
  body("address")
    .matches(/^[^'";=_()*&%$#!<>\/\^\\]*$/)
    .trim(),
  body("poBoxAptRR").if(body("poBoxAptRR").notEmpty()).isNumeric().trim(),
  body("town").if(body("town").notEmpty()).isAlpha().trim(),
  body("postalCode").if(body("postalCode").notEmpty()).isAlphanumeric().trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("dogtags/editOwner", {
        title: "BWG | Edit Owner",
        message: "Form Error!",
      });
    } else {
      // insert into owner table.
      dbHelpers.updateOwner(
        req.body.firstName,
        req.body.lastName,
        req.body.homePhone,
        req.body.cellPhone,
        req.body.workPhone,
        req.body.email,
        req.body.address,
        req.body.poBoxAptRR,
        req.body.town,
        req.body.postalCode,
        req.session.ownerID
      );

      // redirect back to dogtag index after success.
      res.redirect("/dogtags");
    }
  }
);

/* GET /addDog */
router.get(
  "/addDog/:id",
  param("id").matches(/^\d+$/).trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("dogtags/addDog", {
        title: "BWG | Add Dog",
        message: "Page Error!",
      });
    } else {
      // check if there's an error message in the session
      let messages = req.session.messages || [];

      // clear session messages
      req.session.messages = [];

      return res.render("dogtags/addDog", {
        title: "BWG | Add Dog",
        errorMessages: messages,
        email: req.session.email,
      });
    }
  }
);

/* POST addDog page. */
router.post(
  "/addDog/:id",
  body("tagNumber").if(body("tagNumber").notEmpty()).isNumeric().trim(),
  body("dogName").if(body("dogName").notEmpty()).isAlpha().trim(),
  body("breed")
    .if(body("breed").notEmpty())
    .matches(/^[a-zA-Z ]+$/)
    .trim(),
  body("colour").if(body("colour").notEmpty()).isAlpha().trim(),
  body("dateOfBirth").if(body("dateOfBirth").notEmpty()).isDate().trim(),
  body("gender").if(body("gender").notEmpty()).isAlpha().trim(),
  body("spade").if(body("spade").notEmpty()).isAlpha().trim(),
  body("designation").if(body("designation").notEmpty()).isAlpha().trim(),
  body("rabiesTagNumber")
    .if(body("rabiesTagNumber").notEmpty())
    .isNumeric()
    .trim(),
  body("rabiesExpiry").if(body("rabiesExpiry").notEmpty()).isDate().trim(),
  body("vetOffice").if(body("vetOffice").notEmpty()).isAlpha().trim(),
  body("issueDate").if(body("issueDate").notEmpty()).isDate().trim(),
  body("expiryDate").if(body("expiryDate").notEmpty()).isDate().trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("dogtags/addDog", {
        title: "BWG | Add Dog",
        message: "Form Error!",
        email: req.session.email,
        formData: {
          tagNumber: req.body.tagNumber,
          dogName: req.body.dogName,
          breed: req.body.breed,
          colour: req.body.colour,
          dateOfBirth: req.body.dateOfBirth,
          rabiesTagNumber: req.body.rabiesTagNumber,
          rabiesExpiry: req.body.rabiesExpiry,
          vetOffice: req.body.vetOffice,
          issueDate: req.body.issueDate,
          expiryDate: req.body.expiryDate,
        },
      });
    } else {
      // insert dog & license into db.
      dbHelpers.insertDog(
        req.body.tagNumber,
        req.body.dogName,
        req.body.breed,
        req.body.colour,
        req.body.dateOfBirth,
        req.body.gender,
        req.body.spade,
        req.body.designation,
        req.body.rabiesTagNumber,
        req.body.rabiesExpiry,
        req.body.vetOffice,
        req.session.ownerID,
        // license
        req.body.issueDate,
        req.body.expiryDate,
        req.session.ownerID
      );

      // redirect to /dogtags
      res.redirect("/dogtags");
    }
  }
);

/* GET /dogtags/editDog/:id */
router.get(
  "/editDog/:id",
  param("id").matches(/^\d+$/).trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("dogtags/editDog", {
        title: "BWG | Edit Dog",
        message: "Page Error!",
      });
    } else {
      // check if there's an error message in the session
      let messages = req.session.messages || [];

      // clear session messages
      req.session.messages = [];

      // get dog info from custom query.
      var dogInfo = await dbHelpers.getDogInfo(req.params.id);

      return res.render("dogtags/editDog", {
        title: "BWG | Edit Dog",
        errorMessages: messages,
        email: req.session.email,
        dogInfo: {
          tagNumber: dogInfo[0].tagNumber,
          dogName: dogInfo[0].dogName,
          breed: dogInfo[0].breed,
          colour: dogInfo[0].colour,
          dateOfBirth: dogInfo[0].dateOfBirth,
          gender: dogInfo[0].gender,
          spade: dogInfo[0].spade,
          designation: dogInfo[0].designation,
          rabiesTagNumber: dogInfo[0].rabiesTagNumber,
          rabiesExpiry: dogInfo[0].rabiesExpiry,
          vetOffice: dogInfo[0].vetOffice,
          issueDate: dogInfo[0].issueDate,
          expiryDate: dogInfo[0].expiryDate,
        },
      });
    }
  }
);

/* POST /editDog/:id */
router.post(
  "/editDog/:id",
  body("tagNumber").if(body("tagNumber").notEmpty()).isNumeric().trim(),
  body("dogName").if(body("dogName").notEmpty()).isAlpha().trim(),
  body("breed")
    .if(body("breed").notEmpty())
    .matches(/^[a-zA-Z ]+$/)
    .trim(),
  body("colour").if(body("colour").notEmpty()).isAlpha().trim(),
  body("dateOfBirth").if(body("dateOfBirth").notEmpty()).isDate().trim(),
  body("gender").if(body("gender").notEmpty()).isAlpha().trim(),
  body("spade").if(body("spade").notEmpty()).isAlpha().trim(),
  body("designation").if(body("designation").notEmpty()).isAlpha().trim(),
  body("rabiesTagNumber")
    .if(body("rabiesTagNumber").notEmpty())
    .isNumeric()
    .trim(),
  body("rabiesExpiry").if(body("rabiesExpiry").notEmpty()).isDate().trim(),
  body("vetOffice").if(body("vetOffice").notEmpty()).isAlpha().trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("dogtags/editDog", {
        title: "BWG | Edit Dog",
        message: "Form Error!",
        email: req.session.email,
        dogInfo: {
          tagNumber: req.body.tagNumber,
          dogName: req.body.dogName,
          breed: req.body.breed,
          colour: req.body.colour,
          dateOfBirth: req.body.dateOfBirth,
          rabiesTagNumber: req.body.rabiesTagNumber,
          rabiesExpiry: req.body.rabiesExpiry,
          vetOffice: req.body.vetOffice,
        },
      });
    } else {
      // update dog.
      dbHelpers.updateDog(
        req.body.tagNumber,
        req.body.dogName,
        req.body.breed,
        req.body.colour,
        req.body.dateOfBirth,
        req.body.gender,
        req.body.spade,
        req.body.designation,
        req.body.rabiesTagNumber,
        req.body.rabiesExpiry,
        req.body.vetOffice,
        req.session.ownerID,
        req.params.id // dogID
      );

      // redirect to /dogtags
      res.redirect("/dogtags/owner/" + req.session.ownerID);
    }
  }
);

/* GET /dogtags/renew/:id page. */
router.get(
  "/renew/:id",
  param("id").isNumeric().trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("dogtags/renew", {
        title: "BWG | Renew",
        message: "Page Error!",
        email: req.session.email,
      });
    } else {
      // check if there's an error message in the session
      let messages = req.session.messages || [];

      // clear session messages
      req.session.messages = [];

      return res.render("dogtags/renew", {
        title: "BWG | Renew",
        errorMessages: messages,
        email: req.session.email,
      });
    }
  }
);

/* POST /dogtags/renew/:id */
router.post(
  "/renew/:id",
  body("issueDate").isDate().trim(),
  body("expiryDate").isDate().trim(),
  param("id").matches(/^\d+$/).trim(),
  async (req, res, next) => {
    // server side validation.
    const errors = validationResult(req);

    // if errors is NOT empty (if there are errors...)
    if (!errors.isEmpty()) {
      return res.render("dogtags/renew", {
        title: "BWG | Renew",
        message: "Form Error!",
        email: req.session.email,
      });
    } else {
      // update licenses.
      dbHelpers.updateLicenses(
        req.body.issueDate,
        req.body.expiryDate,
        req.params.id
      );

      // redirect back to dogtags.
      res.redirect("/dogtags");
    }
  }
);

module.exports = router;
