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
//   var authId = "MAM2EYNJK3ZDHMZJQXN2";
//   var authToken = "NWY5YTE1ODRiNWNlMmJjMGI1NjE1MjkzMGIwNWU0";
//   var phloId = "e05a43a8-8be9-491d-a0b1-06b4fac88b72";
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
      src: "TownOfBWG",
      dst: "+12893835612",
      text: "test",
    })
    .then(function (message_created) {
      console.log(message_created);
    });
});

module.exports = router;