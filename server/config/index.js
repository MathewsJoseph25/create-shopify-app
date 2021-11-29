const dotenv = require("dotenv");
dotenv.config();
const dev = process.env.NODE_ENV !== "production";
if (dev) {
  global.SHOPIFY_API_SECRET_KEY = process.env.DEV_SHOPIFY_API_SECRET_KEY;
  global.SHOPIFY_API_KEY = process.env.DEV_SHOPIFY_API_KEY;
  global.SHOPIFY_REDIRECT_URI = process.env.DEV_SHOPIFY_REDIRECT_URI;
  global.SHOPIFY_WEBHOOK_URI = process.env.DEV_SHOPIFY_WEBHOOK_URI;
  global.MONGODB_URI = process.env.DEV_MONGODB_URI;
} else {
  global.SHOPIFY_API_SECRET_KEY = process.env.PROD_SHOPIFY_API_SECRET_KEY;
  global.SHOPIFY_API_KEY = process.env.PROD_SHOPIFY_API_KEY;
  global.SHOPIFY_REDIRECT_URI = process.env.PROD_SHOPIFY_REDIRECT_URI;
  global.SHOPIFY_WEBHOOK_URI = process.env.PROD_SHOPIFY_WEBHOOK_URI;
  global.MONGODB_URI = process.env.PROD_MONGODB_URI;
}
// global.API_VERSION = "2020-07";
global.SCOPES = "read_products, write_products,read_inventory, write_inventory, read_orders, write_orders, read_customers, write_customers";
global.API_VERSION = "2021-10";