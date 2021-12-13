const crypto = require("crypto");

// Verify incoming webhook.
const verifyWebhook = (payload, hmac) => {
  const message = payload.toString();
  const genHash = crypto
    .createHmac("sha256", SHOPIFY_API_SECRET_KEY)
    .update(message)
    .digest("base64");
  return genHash === hmac;
};

module.exports = verifyWebhook;
