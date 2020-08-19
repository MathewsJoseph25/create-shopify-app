/*
AIM: To create a basic FREE App to install on a shopify store wtih JWT authentication and with webhooks set for both shop/update and app/uninstalled. 

The project is divided into 8 parts:
PART 1: Initialization of objects
PART 2: Serving static assets without auth
PART 3: Functions for adding webhook to shop, verifying incoming webhook, handling webhook,
        verifying URL HMAC, generating redirect url to install the app and middleware for verifying Api Requests.
PART 4: Handling webhook route
PART 5: Handling Authentication Routes
PART 6: Handling API routes
PART 7: Handling Un-Authenticated App Page routes
PART 8: NextJS Preparing and Server Listening

Basic overview of the app:
Database - MongoDB (You can also use MongoDB atlas)
Authentication - Shopify JWT



How to get started:
1. run "npm install" to install dependencies
2. update the environment variables on the .env file.
3. start a node server and a ngrok instance 
4. update app urls (main and callbacks) on the partner dashboard.
  on main url use https://{hostname}/auth
  on callbacks use https://{hostname}/auth/callback
5. Install the app on a development store from your partner dashboard.

NOTE: For webhook to work according to this server.js, you need to setup the webhok url in evironment file to 
https://{{hostname}}/webhooks
*/

//PART 1: Initialization
const express = require("express");
const nextapp = require("next");
const dotenv = require("dotenv");
const server = express();
const bodyParser = require("body-parser");
const nonceCreate = require("nonce")();
server.use(bodyParser.raw({ type: "application/json" }));
const querystring = require("querystring");
const axios = require("axios");
dotenv.config();

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = nextapp({ dev });
const handle = app.getRequestHandler();
const crypto = require("crypto");
var SHOPIFY_API_SECRET_KEY,
  SHOPIFY_API_KEY,
  SHOPIFY_REDIRECT_URI,
  SHOPIFY_WEBHOOK_URI,
  MONGODB_URI;
if (dev) {
  SHOPIFY_API_SECRET_KEY = process.env.DEV_SHOPIFY_API_SECRET_KEY;
  SHOPIFY_API_KEY = process.env.DEV_SHOPIFY_API_KEY;
  SHOPIFY_REDIRECT_URI = process.env.DEV_SHOPIFY_REDIRECT_URI;
  SHOPIFY_WEBHOOK_URI = process.env.DEV_SHOPIFY_WEBHOOK_URI;
  MONGODB_URI = process.env.DEV_MONGODB_URI;
} else {
  SHOPIFY_API_SECRET_KEY = process.env.PROD_SHOPIFY_API_SECRET_KEY;
  SHOPIFY_API_KEY = process.env.PROD_SHOPIFY_API_KEY;
  SHOPIFY_REDIRECT_URI = process.env.PROD_SHOPIFY_REDIRECT_URI;
  SHOPIFY_WEBHOOK_URI = process.env.PROD_SHOPIFY_WEBHOOK_URI;
  MONGODB_URI = process.env.PROD_MONGODB_URI;
}
const API_VERSION = "2020-07";

const scopes = "write_products, write_themes";

//init mongoose and schema

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
// Make Mongoose use `findOneAndUpdate()`. Note that this option is `true`
// by default, you need to set it to false.
mongoose.set("useFindAndModify", false);
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const Schema = mongoose.Schema;

const shopSchema = new Schema({
  shop: { type: String, required: true },
  accessToken: { type: String, default: null },
  scopes: { type: String, default: null },
  isInstalled: { type: Boolean, default: false },
  installedOn: { type: Date, default: Date.now() },
  uninstalledOn: { type: Date, default: null },
  nonce: { type: String, default: null },
  webhooks: { type: Object, default: {} },
  info: { type: Object, default: {} },
});

const Shop = mongoose.model("shop", shopSchema);

//init api routes
const apiRoutes = require("./api");
const { info } = require("console");

/* --------------------------------------------------------------------------------------- */

// PART 2: Serving static assets without auth

//Serve static assets without auth
server.get("/_next/*", (req, res) => {
  return handle(req, res);
});

/* --------------------------------------------------------------------------------------- */

//PART 3: Functions for adding webhook to shop, verifying incoming webhook, handling webhook,
// verifying URL HMAC, generating redirect url to install the app and middle for verifying Api Requests

//function to add Webhooks to the store and set data to the database
async function addWebhooks(shop, accessToken, webhooks) {
  //webhooks object needs to be an array
  var webhookData = {};
  const header = {
    "X-Shopify-Access-Token": accessToken,
  };
  for (var i = 0; i < webhooks.length; i++) {
    //setting the data value to check at later stage if webhook was created successfully or not.
    const webhookHandle = webhooks[i].replace("/", "_");
    webhookData[webhookHandle] = null;
    //Creating topic payload
    var topic = {
      webhook: {
        topic: webhooks[i],
        address: SHOPIFY_WEBHOOK_URI,
        format: "json",
      },
    };

    try {
      //creating the webhook
      let webhook = await axios({
        method: "POST",
        url: "https://" + shop + "/admin/api/" + API_VERSION + "/webhooks.json",
        headers: header,
        data: topic,
      });
      webhookData[webhookHandle] = webhook.data.webhook;
    } catch (error) {
      console.log("Error while Creating Webhook: " + webhooks[i]);
      console.log(error);
    }
  }

  try {
    //Adding webhook data to database
    let hook = await Shop.findOne({
      shop: shop.replace("https://", "").replace("http://", "").split(".")[0],
    });
    for (var i = 0; i < webhooks.length; i++) {
      const webhookHandle = webhooks[i].replace("/", "_");
      if (webhookData[webhookHandle]) {
        hook.webhooks[webhookHandle] = webhookData[webhookHandle];
      }
    }
    hook.markModified("webhooks");
    await hook.save();
  } catch (e) {
    console.log("Error while Adding Webhook Data to Database");
    console.log(error);
    console.log(error);
  }
}

// Verify incoming webhook.
function verifyWebhook(payload, hmac) {
  const message = payload.toString();
  const genHash = crypto
    .createHmac("sha256", SHOPIFY_API_SECRET_KEY)
    .update(message)
    .digest("base64");
  return genHash === hmac;
}

//Handling  incomming webhooks
async function handleAppUninstall(payload, shop) {
  //checking if the app is really uninstalled because if someone installes, uninstalls and reinstalls quickly,
  //we may get the webhook after the 2nd install is completed and so, we don't want to remove the access token in that case

  try {
    let shopFromDatabase = await Shop.findOne({
      shop: shop.replace("https://", "").replace("http://", "").split(".")[0],
    });
    //Store lookup
    const header = {
      "X-Shopify-Access-Token": shopFromDatabase.accessToken,
    };
    const info = await axios({
      url:
        "https://" +
        shop.replace("https://", "").replace("http://", "").split(".")[0] +
        ".myshopify.com/admin/api/" +
        API_VERSION +
        "/shop.json",
      headers: header,
    });

    //if we have 'shop' in the returned data, then, the store is installed and so, don't remove data from database
    if (info.data.shop) {
      console.log("Uninstall Webhook from Installed Store Received!");
      return;
    }
  } catch (error) {
    //If the shop isn't installed, Shopify returns 401 and Axios will throw an unauthenticated request error
    //So, we can now remove the data from the database
  }

  try {
    await Shop.findOneAndUpdate(
      {
        shop: shop.replace("https://", "").replace("http://", "").split(".")[0],
      },
      {
        uninstalledOn: Date.now(),
        isInstalled: false,
        accessToken: null,
        webhooks: {},
      }
    );
  } catch (error) {
    console.log("Error while Webhook - Shop Uninstall");
    console.log(error);
  }
}

async function handleShopUpdate(payload, shop) {
  try {
    await Shop.findOneAndUpdate(
      {
        shop: shop.replace("https://", "").replace("http://", "").split(".")[0],
      },
      { info: payload }
    );
  } catch (error) {
    console.log("Error while Webhook - Shop Update");
    console.log(error);
  }
}

//function to verfify url HMAC
function verifyUrlHMAC(req) {
  const q = querystring.unescape(req.originalUrl).split("?");
  let s = q[1].split("&");
  let check = "";
  for (var i = 0; i < s.length; i++) {
    if (s[i].indexOf("hmac") == -1) {
      check += s[i] + "&";
    }
  }
  let urlToCheck = check.slice(0, -1);
  let hashToCheck = crypto
    .createHmac("SHA256", SHOPIFY_API_SECRET_KEY)
    .update(urlToCheck)
    .digest("hex");
  return hashToCheck == req.query.hmac;
}

//function for generating install url by adding store and nonce to database
async function getInstallUrl(shop) {
  let nonce = nonceCreate();
  try {
    let shopUpdate = await Shop.updateOne(
      { shop: shop },
      { shop: shop, nonce: nonce },
      { upsert: true }
    );
  } catch (error) {
    console.log("Error while adding Nonce to Database");
    console.log(error);
    return false;
  }
  return (
    "https://" +
    shop +
    ".myshopify.com/admin/oauth/authorize?client_id=" +
    SHOPIFY_API_KEY +
    "&scope=" +
    scopes +
    "&redirect_uri=" +
    SHOPIFY_REDIRECT_URI +
    "&state=" +
    nonce
  );
}

//Middleware for verifying Api Requests
function authApiRequest(req, res, next) {
  if (req.header("Authorization")) {
    const auth = req.header("Authorization");
    //Extracting the data
    let [header, payload, signature] = auth.split(".");

    //Verifying the auth
    const checkhmac = decodeURI(header + "." + payload);
    const genHash = crypto
      .createHmac("sha256", SHOPIFY_API_SECRET_KEY)
      .update(checkhmac)
      .digest("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/g, "");
    if (genHash === signature) {
      header = JSON.parse(Buffer.from(header, "base64"));
      payload = JSON.parse(Buffer.from(payload, "base64"));

      //Getting current time to verfity the auth timestamp limits
      const cTime = Date.now() / 1000;
      //verifying payload
      if (
        payload.exp < cTime ||
        payload.nbf > cTime ||
        payload.iss.replace("https://", "").split(".")[0] !=
          payload.dest.replace("https://", "").split(".")[0] ||
        payload.aud != SHOPIFY_API_KEY
      ) {
        return res.json({ error: "Token Verification Failed" });
      }

      //JWT Verified!
      res.locals.shop = payload.dest;
      next();
    } else {
      res.json({
        error: "Token Verification Failed",
      });
    }
  } else {
    res.json({ error: "Unauthorized Request" });
  }
}

/* --------------------------------------------------------------------------------------- */

//PART 4: Handling Webhooks route

server.post("/webhooks", async (req, res) => {
  // Verify
  const hmac = req.header("X-Shopify-Hmac-Sha256");
  const topic = req.header("X-Shopify-Topic");
  const shop = req.header("X-Shopify-Shop-Domain");

  const verified = verifyWebhook(req.body, hmac);

  if (!verified) {
    console.log("Failed to verify the incoming request.");
    res.status(401).send("Could not verify request.");
    return;
  }

  const data = req.body.toString();
  const payload = JSON.parse(data);
  res.status(200).send("OK");
  switch (topic) {
    case "app/uninstalled":
      handleAppUninstall(payload, shop);
      break;
    case "shop/update":
      handleShopUpdate(payload, shop);
      break;
  }
});

/* --------------------------------------------------------------------------------------- */

//PART 5: Handling Authentication Routes

//Authentication Url
server.get("/auth", async (req, res) => {
  //check if shop param is present on the url
  if (req.query.shop && req.query.shop.indexOf("myshopify") != -1) {
    req.query.shop = req.query.shop
      .replace("https://", "")
      .replace("http://", "")
      .split(".")[0];

    //check if shop is installed
    let shop;
    try {
      shop = await Shop.findOne({ shop: req.query.shop });
    } catch (error) {
      console.log("Error while Store lockup on database during auth");
      console.log(error);
      res.send("An Error Occurred! Please go back and try again");
    }

    if (shop && shop.isInstalled) {
      /*
      We have shop data in our database, but if a customer uninstalls and try to reinstall the app quickly, 
      then, we may not have got the uninstall webhook yet and so, we may think that the shop is installed,
      but, it isn't. To solve this problem, we'll request the shop info from shopify using the auth token that 
      we have on our database. So, if the shop has been uninstalled, we'll not get the shop data and so, we can confirm
      in that case that our app isn't installed and so, we can redirect to the install url. 
      
      When the app is installed, this auth phase only happens on the first app load and all subsequest loads doesn't have
      to go through this store lookup process again and so, it won't add latency to future calls to our server from the store.
      */

      //Store lookup
      try {
        const header = {
          "X-Shopify-Access-Token": shop.accessToken,
        };
        const info = await axios({
          url:
            "https://" +
            req.query.shop +
            ".myshopify.com/admin/api/" +
            API_VERSION +
            "/shop.json",
          headers: header,
        });

        //if we have 'shop' in the returned data, the store is installed
        if (info.data.shop) {
          //redirect to index page with the shop param to serve the app
          const url = "/?shop=" + req.query.shop + ".myshopify.com";
          res.redirect(url);
          return;
        }
      } catch (error) {
        //If the shop isn't installed, Shopify returns 401 and Axios will throw an unauthenticated request error
        //So, we need to redirect to the install url.
      }
    }

    //Redirect to install url if shop isn't installed.
    try {
      let installUrl = await getInstallUrl(
        req.query.shop
          .replace("https://", "")
          .replace("http://", "")
          .split(".")[0]
      );
      if (installUrl) res.redirect(installUrl);
      else res.send("An Error Occurred! Please go back and try again.");
    } catch (error) {
      console.log("Error when generating redirect url for install");
      console.log(error);
      res.send("An Error Occurred! Please go back and try again");
    }
  } else {
    //let the customer know to add the shop parameter
    res.send("shop param missing/invalid. Please add that param");
  }
});

//Authentication Callback
server.get("/auth/callback", async (req, res) => {
  //Step 1: Verify HMAC
  if (!verifyUrlHMAC(req)) {
    console.log("Error while Authenticate Callback - HMAC Check");
    res.send("Unauthenticated Request!");
    return;
  }
  //Step 2: Check nonce value
  try {
    var nonce = await Shop.findOne(
      {
        shop: req.query.shop
          .replace("https://", "")
          .replace("http://", "")
          .split(".")[0],
      },
      "nonce"
    );
  } catch (error) {
    console.log(
      "Error while Authenticate Callback - Nonce Fetch From Database"
    );
    console.log(error);
    res.send("An Error Occured while validating request");
    return;
  }
  if (req.query.state != nonce.nonce) {
    console.log("Error while Authenticate Callback Nonce Check");
    res.send("Unauthenticated Request!");
    return;
  }
  //Step:3: Get Access Token from Shopify and save to Database
  try {
    const body = {
      client_id: SHOPIFY_API_KEY,
      client_secret: SHOPIFY_API_SECRET_KEY,
      code: req.query.code,
    };
    var accessToken = await axios({
      method: "post",
      url: "https://" + req.query.shop + "/admin/oauth/access_token",
      data: body,
    });
    await Shop.findOneAndUpdate(
      {
        shop: req.query.shop
          .replace("https://", "")
          .replace("http://", "")
          .split(".")[0],
      },
      {
        installedOn: Date.now(),
        isInstalled: true,
        accessToken: accessToken.data.access_token,
        scopes: accessToken.data.scope,
      }
    );
  } catch (error) {
    console.log(
      "Error while Fetching Access Token or Adding to database On Install"
    );
    console.log(error);
    res.send("An Error Occured while installing! Please try again.");
    return;
  }
  //Step 4: Fetch Shop Info from Shopify and save to database
  try {
    const header = {
      "X-Shopify-Access-Token": accessToken.data.access_token,
    };
    const info = await axios({
      url:
        "https://" +
        req.query.shop +
        "/admin/api/" +
        API_VERSION +
        "/shop.json",
      headers: header,
    });

    await Shop.findOneAndUpdate(
      {
        shop: req.query.shop
          .replace("https://", "")
          .replace("http://", "")
          .split(".")[0],
      },
      {
        info: info.data.shop,
        nonce: null,
        webhooks: {},
      }
    );
  } catch (error) {
    console.log(
      "Error while Fetching Shop Info or Adding to database On Install"
    );
    console.log(error);
    res.send("An Error Occured while installing! Please try again.");
    return;
  }
  req.query.accessToken = accessToken.data.access_token;
  //Step 5: create webhooks
  addWebhooks(
    req.query.shop.replace("https://", "").replace("http://", ""),
    accessToken.data.access_token,
    ["app/uninstalled", "shop/update"]
  );

  //Step 6: Redirect to the index page with shop params
  const url =
    "/?shop=" +
    req.query.shop
      .replace("https://", "")
      .replace("http://", "")
      .split(".")[0] +
    ".myshopify.com";
  res.redirect(url);
});

/* --------------------------------------------------------------------------------------- */

//PART 6: Handling API routes

server.use("/api", authApiRequest, apiRoutes);

/* --------------------------------------------------------------------------------------- */

//PART 7: Handling Un-Authenticated App Page routes

// Middleware for checking if shop param is present for all app page requests
server.use(async (req, res, next) => {
  //check if shop param is present on the url
  if (req.query.shop && req.query.shop.indexOf("myshopify") != -1) {
    req.query.shop = req.query.shop
      .replace("https://", "")
      .replace("http://", "")
      .split(".")[0];

    //check if shop is installed
    try {
      var shop = await Shop.findOne({ shop: req.query.shop });
    } catch (error) {
      console.log("Error when Store lockup on database");
      console.log(error);
      res.send("An Error Occurred! Please go back and try again");
    }
    if (shop && shop.isInstalled) {
      next();
    } else {
      //Redirect to install url if shop isn't installed.
      try {
        let installUrl = await getInstallUrl(
          req.query.shop
            .replace("https://", "")
            .replace("http://", "")
            .split(".")[0]
        );
        if (installUrl) res.redirect(installUrl);
        else res.send("An Error Occurred! Please go back and try again.");
      } catch (error) {
        console.log("Error when generating redirect url for install");
        console.log(error);
        res.send("An Error Occurred! Please go back and try again");
      }
    }
  } else {
    //let the customer know to add the shop parameter
    res.send("shop param missing/invalid. Please add that param");
  }
});

server.get("*", (req, res) => {
  return handle(req, res);
});

/* --------------------------------------------------------------------------------------- */

//PART 8: NextJS Preparing and Server Listening

app
  .prepare()
  .then(() => {
    server.listen(port, () => {
      console.log(`Shopify app listening at http://localhost:${port}`);
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });
