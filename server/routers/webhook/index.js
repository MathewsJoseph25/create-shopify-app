const webhooks = require("express").Router();
const verifyWebhook = require("./helpers/verifyWebhook");
const handleAppUninstall = require("./handlers/appUninstall");
const handleShopUpdate = require("./handlers/shopUpdate");

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
  }
});

module.exports = webhooks;
