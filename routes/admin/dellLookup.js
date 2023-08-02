var express = require("express");
var router = express.Router();
const axios = require("axios");
const csv = require("csv-parser");
const multer = require("multer");
const fs = require("fs");
// create middleware for uploads.
const upload = multer({
  dest: "../uploads",
});
// p-limit. library to limit number of concurrent requests in a Promise.
const pLimit = require("p-limit");
// number of concurrent requests to limit to.
const limit = pLimit(8);

/* get auth_token */
// gather info for request to get auth_token
const authUrl = "https://apigtwb2c.us.dell.com/auth/oauth/v2/token";
// Dell API requires request to be sent with this Content-Type.
const config = {
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
};
const tokenRequestData = {
  client_id: process.env.DELL_CLIENT_ID,
  client_secret: process.env.DELL_CLIENT_SECRET,
  grant_type: process.env.DELL_GRANT_TYPE,
};

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
router.post("/", upload.single("csvFile"), async (req, res, next) => {
  // check if there's an error message in the session
  let messages = req.session.messages || [];
  // clear session messages
  req.session.messages = [];

  // get auth_token.
  const auth_response = await axios.post(authUrl, tokenRequestData, config);
  // update the global auth token variable.
  //let authToken = "";
  let authToken = auth_response.data.access_token;
  // once authToken has been accessed, save it here for later.
  const options = {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  };

  // if searching by serviceTag.
  if (req.body.serviceTag) {
    // make the requests
    try {
      // get serviceTag from form and append to API endpoint that contains warranty info.
      const apiUrl =
        "https://apigtwb2c.us.dell.com/PROD/sbil/eapi/v5/asset-entitlements?servicetags=" +
        req.body.serviceTag;
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
      // return page with error message if error is found.
      return res.render("admin/dellLookup", {
        title: "BWG | Dell Lookup",
        message: "Page Error!",
        auth: req.session.auth, // authorization.
      });
    }
    // else .csv must have been uploaded.
  } else {
    // to store the .csv
    const results = [];

    // read the .csv
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        // this will create an array of Promises to use for Promise.all().
        const promises = results.map(async (row) => {
          // save the computerName & serviceTag to append as apart of the resposne.
          const { computerName, serviceTag } = row;

          try {
            // make the GET request using p-limit.
            const response = await limit(() =>
              axios.get(
                `https://apigtwb2c.us.dell.com/PROD/sbil/eapi/v5/asset-entitlements?servicetags=${encodeURIComponent(
                  serviceTag
                )}`,
                options
              )
            );
            // extract info from the API.
            const entitlements = response.data[0].entitlements;
            const lastEntitlement = entitlements[entitlements.length - 1];
            const shipDate = response.data[0].shipDate;
            const endDate = lastEntitlement.endDate;

            // return the Promise.
            return {
              shipDate,
              endDate,
              serviceTag,
              computerName,
            };
          } catch (err) {
            // return page with error message if error is found.
            return res.render("admin/dellLookup", {
              title: "BWG | Dell Lookup",
              message: "Page Error!",
              auth: req.session.auth,
            });
          }
        });

        try {
          // this will actually send all of the requests to the API limiting the concurrent requests to what was specified above.
          const responseData = await Promise.all(promises);

          // return page with data.
          return res.render("admin/dellLookup", {
            title: "BWG | Dell Lookup",
            message: messages,
            auth: req.session.auth,
            csvWarrantyInfo: responseData,
          });
        } catch (err) {
          // return page with error message if error is found.
          return res.render("admin/dellLookup", {
            title: "BWG | Dell Lookup",
            message: "Page Error!",
            auth: req.session.auth,
          });
        }
      });
  }
});

module.exports = router;
