const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const shopSchema = new Schema({
  shop: { type: String, required: true },
  accessToken: { type: String, default: null },
  serial: {type:Number, default: null, min:700000000, max:800000000, minLength:9, maxLength:9},
  scopes: { type: String, default: null },
  isInstalled: { type: Boolean, default: false },
  installedOn: { type: Date, default: Date.now() },
  uninstalledOn: { type: Date, default: null },
  nonce: { type: String, default: null },
  webhooks: { type: Object, default: {} },
  info: { type: Object, default: {} },
});

const Shop = mongoose.models.shop || mongoose.model("shop", shopSchema);

module.exports = Shop;
