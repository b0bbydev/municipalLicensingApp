var express = require("express");
var router = express.Router();
const axios = require("axios");

/* GET /dellLookup page. */
router.get("/", async (req, res, next) => {
  // check if there's an error message in the session
  let messages = req.session.messages || [];
  // clear session messages
  req.session.messages = [];

  return res.render("admin/dellLookup", {
    title: "BWG | Dell Lookup",
    message: messages,
    email: req.session.email,
    auth: req.session.auth, // authorization.
  });
});

/* /dellLookup API form */
router.post("/", async (req, res, next) => {
  // check if there's an error message in the session
  let messages = req.session.messages || [];
  // clear session messages
  req.session.messages = [];

  // gather info for request to get auth_token
  const authUrl = "https://apigtwb2c.us.dell.com/auth/oauth/v2/token";
  let authToken = "";
  const tokenRequestData = {
    client_id: process.env.DELL_CLIENT_ID,
    client_secret: process.env.DELL_CLIENT_SECRET,
    grant_type: process.env.DELL_GRANT_TYPE,
  };
  // Dell API requires request to be sent with this Content-Type.
  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  // get serviceTag from form and append to API endpoint that contains warranty info.
  const apiUrl =
    "https://apigtwb2c.us.dell.com/PROD/sbil/eapi/v5/asset-entitlements?servicetags=" +
    req.body.serviceTag;

  // make the requests
  try {
    // auth_token.
    const auth_response = await axios.post(authUrl, tokenRequestData, config);
    // update the global auth token variable.
    authToken = auth_response.data.access_token;

    // api data.
    const options = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };

    // make the GET request to API.
    const api_response = await axios.get(apiUrl, options);
    // retrieved information from the API.
    const data = api_response.data;

    // extract purchase date and warranty expiration date.
    const purchaseDate = data[0].shipDate;
    // break this down to it's own array for the line below it.
    const warrantyExpiration = data[0].entitlements;
    // grab the last object in warrantyExpiration array as it should contain the final warranty expiration.
    const warrantyExpirationDate =
      warrantyExpiration[warrantyExpiration.length - 1].endDate;

    return res.render("admin/dellLookup", {
      title: "BWG | Dell Lookup",
      message: messages,
      email: req.session.email,
      auth: req.session.auth,
      serviceTag: req.body.serviceTag,
      purchaseDate: purchaseDate,
      warrantyExpirationDate: warrantyExpirationDate,
    });
  } catch (err) {
    return res.render("admin/dellLookup", {
      title: "BWG | Dell Lookup",
      message: "Page Error!",
      auth: req.session.auth, // authorization.
    });
  }
});

module.exports = router;
