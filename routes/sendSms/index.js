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
// router.post("/", function (req, res, next) {
//   var PhloClient = plivo.PhloClient;
//   var authId = process.env.AUTH_ID;
//   var authToken = process.env.AUTH_TOKEN;
//   var phloId = "<phlo_id>";
//   var phloClient = (phlo = null);

//   phloClient = new PhloClient(authId, authToken);
//   phloClient
//     .phlo(phloId)
//     .run()
//     .then(function (result) {
//       console.log("Phlo run result", result);
//     })
//     .catch(function (err) {
//       console.error("Phlo run failed", err);
//     });
// });

router.post("/", function (req, res, next) {
  let client = new plivo.Client(process.env.AUTH_ID, process.env.AUTH_TOKEN);
  client.messages
    .create({
      src: process.env.SENDER_ID,
      dst: "+19057156835",
      text: req.body.textMessage,
    })
    .then(function (message_created) {
      console.log(message_created);
    });
});

module.exports = router;
