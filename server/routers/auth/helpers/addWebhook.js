const Shop = require("../../../models/shop");
const axios = require("axios");

const addWebhooks = async (shop, accessToken, webhooks) => {
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
      console.log("Error while Creating Webhook: " + webhooks[i], error);
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
    console.log("Error while Adding Webhook Data to Database", error);
  }
};

module.exports = addWebhooks;
