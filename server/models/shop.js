const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const processSchema = new Schema({
  id: { type: String, index: true, unique: true },
  date: Date,
  type: String,
  processid: String,
  status: String,
  url: String,
  systemName: String,
});

const shopSchema = new Schema({
  shop: { type: String, required: true },
  accessToken: { type: String, default: null },
  serial: {
    type: Number,
    min: [700000000, "Serial Number starts with 7"],
    max: [800000000, "Invalid Serial Number"],
    validate: {
      validator: function (v) {
        return v % 9 === 0;
      },
    },
  },
  scopes: { type: String, default: null },
  isInstalled: { type: Boolean, default: false },
  installedOn: { type: Date, default: Date.now() },
  uninstalledOn: { type: Date, default: null },
  nonce: { type: String, default: null },
  webhooks: { type: Object, default: {} },
  info: { type: Object, default: {} },
  process: [processSchema],
});

const Shop = mongoose.models.shop || mongoose.model("shop", shopSchema);

module.exports = Shop;
