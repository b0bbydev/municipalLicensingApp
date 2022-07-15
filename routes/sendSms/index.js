var express = require("express");
var router = express.Router();
var plivo = require("plivo");

/* GET /sendSms page. */
router.get("/", function (req, res, next) {
  // check if there's an error message in the session
  let messages = req.session.messages || [];
  // clear session messages
  req.session.messages = [];

  return res.render("sendSms/index", {
    title: "BWG | Send SMS",
    errorMessages: messages,
    email: req.session.email,
    auth: req.session.auth, // authorization.
  });
});

/* POST /sendSms page. */
router.post("/", function (req, res, next) {
  var PhloClient = plivo.PhloClient;
  var authId = "<auth_id>";
  var authToken = "<auth_token>";
  var phloId = "<phlo_id>";
  var phloClient = (phlo = null);

  phloClient = new PhloClient(authId, authToken);
  phloClient
    .phlo(phloId)
    .run()
    .then(function (result) {
      console.log("Phlo run result", result);
    })
    .catch(function (err) {
      console.error("Phlo run failed", err);
    });
});

// router.all("/", function (req, res, next) {
//   let client = new plivo.Client("<auth_id>", "<auth_token>");
//   client.messages
//     .create({
//       src: "<sender_id>",
//       dst: "<destination_number>",
//       text: "Hello, from Bobby!",
//     })
//     .then(function (message_created) {
//       console.log(message_created);
//     });
// });

module.exports = router;
