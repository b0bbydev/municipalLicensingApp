var express = require("express");
var router = express.Router();
const axios = require("axios");
const { AuthTokenRefresher } = require("axios-auth-refresh");

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
  const authUrl = "https://apigtwb2c.us.dell.com/auth/oauth/v2/token"; // Replace with the actual token endpoint URL
  let authToken = ""; // Global variable to store the current auth token
  const tokenRequestData = {
    client_id: process.env.DELL_CLIENT_ID,
    client_secret: process.env.DELL_CLIENT_SECRET,
    grant_type: process.env.DELL_GRANT_TYPE,
  };
  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  // gather info for request to get warranty info.
  const apiUrl =
    "https://apigtwb2c.us.dell.com/PROD/sbil/eapi/v5/asset-entitlements?servicetags=" +
    req.body.serviceTag;

  // make the requests
  try {
    // auth_token.
    const auth_response = await axios.post(authUrl, tokenRequestData, config);
    authToken = auth_response.data.access_token; // Update the global auth token variable

    // api data.
    const options = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };

    const api_response = await axios.get(apiUrl, options);
    const data = api_response.data; // Retrieved information from the API

    // extract purchase date and warranty expiration date.
    const purchaseDate = data[0].shipDate;
    console.log(data);

    return res.render("admin/dellLookup", {
      title: "BWG | Dell Lookup",
      message: messages,
      email: req.session.email,
      auth: req.session.auth,
      purchaseDate: purchaseDate,
    });
  } catch (error) {
    return res.render("admin/dellLookup", {
      title: "BWG | Dell Lookup",
      message: "Page Error!",
      auth: req.session.auth, // authorization.
    });
  }

  // try {
  //   const apiUrl =
  //     "https://apigtwb2c.us.dell.com/PROD/sbil/eapi/v5/asset-entitlements?servicetags=" +
  //     req.body.serviceTag;
  //   // BHYFND3
  //   const authToken = "f69adee4-f0be-4086-96a4-03fd1d7e2bde";

  //   const options = {
  //     headers: {
  //       Authorization: `Bearer ${authToken}`,
  //     },
  //   };

  //   const response = await axios.get(apiUrl, options);
  //   const data = response.data; // Retrieved information from the API

  //   return res.render("admin/dellLookup", {
  //     title: "BWG | Dell Lookup",
  //     message: messages,
  //     email: req.session.email,
  //     auth: req.session.auth,
  //     data: data, // Pass the retrieved data to the view template
  //   });
  // } catch (error) {
  //   return res.render("admin/dellLookup", {
  //     title: "BWG | Dell Lookup",
  //     message: "Page Error!",
  //     auth: req.session.auth, // authorization.
  //   });
  // }
});

module.exports = router;
