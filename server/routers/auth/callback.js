const axios = require("axios");
const Shop = require("../../models/shop");
const verifyUrlHMAC = require("./helpers/verifyUrlHMAC");
const addWebhooks = require("./helpers/addWebhook");

const callback = async (req, res) => {
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
      "Error while Authenticate Callback - Nonce Fetch From Database: ",
      error
    );
    res.send("An Error Occured while validating request");
    return;
  }
  if (req.query.state != nonce.nonce) {
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
      "Error while Fetching Access Token or Adding to database On Install: ",
      error
    );
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
      "Error while Fetching Shop Info or Adding to database On Install: ",
      error
    );
    res.send("An Error Occured while installing! Please try again.");
    return;
  }
  //Step 5: create webhooks

  try {
    const wh = addWebhooks(
      req.query.shop.replace("https://", "").replace("http://", ""),
      accessToken.data.access_token,
      ["app/uninstalled", "shop/update"]
    );
    if (wh) {
      console.log("Webhooks added :: " + wh);
    }
  } catch (e) {
    console.log("Errors while adding webhooks :: " + e);
  }

  //Step 6: Redirect to the index page with shop params
  const url =
    "/?shop=" +
    req.query.shop
      .replace("https://", "")
      .replace("http://", "")
      .split(".")[0] +
    ".myshopify.com";
  res.redirect(url);
};

module.exports = callback;
