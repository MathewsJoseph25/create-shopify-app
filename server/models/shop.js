const mongoose = require("mongoose");
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

module.exports = Shop;
