const webhooks = require("express").Router();
const verifyWebhook = require("./helpers/verifyWebhook");
const handleAppUninstall = require("./handlers/appUninstall");
const handleShopUpdate = require("./handlers/shopUpdate");
const handleShopDelete = require("./handlers/shopredact");
const handleCustomersDataRequest = require("./handlers/customerdatarequest");
const handleCustomersRedact = require("./handlers/customerredact");

webhooks.post("/", (req, res) => {
  // Verify
  const hmac = req.header("X-Shopify-Hmac-Sha256");
  const topic = req.header("X-Shopify-Topic");
  const shop = req.header("X-Shopify-Shop-Domain");

  const verified = verifyWebhook(req.body, hmac);

  if (!verified) {
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
    case "customers/data_request":
      handleCustomersDataRequest(payload, shop);
      break;
    case "customers/redact":
      handleCustomersRedact(payload, shop);
      break;
    case "shop/redact":
      handleShopDelete(payload, shop);
      break;
  }
});

module.exports = webhooks;
