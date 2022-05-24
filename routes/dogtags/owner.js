var express = require("express");
var router = express.Router();
// dbHelpers.
var dbHelpers = require("../../config/dbHelpers");
// express-validate.
const { param, validationResult } = require("express-validator");

/* GET owner page. */
router.get(
  "/:id",
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

module.exports = router;
