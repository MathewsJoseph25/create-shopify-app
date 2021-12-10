require("dotenv").config();
const withCSS = require("@zeit/next-css");
const webpack = require("webpack");
const dev = process.env.NODE_ENV !== "production";
var apiKey;
if (dev) apiKey = JSON.stringify(process.env.DEV_SHOPIFY_API_KEY);
else apiKey = JSON.stringify(process.env.PROD_SHOPIFY_API_KEY);

module.exports = withCSS({
  webpack: (config) => {
    const env = { API_KEY: apiKey };
    config.plugins.push(new webpack.DefinePlugin(env));
    return config;
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors https://cambridgetestshop.myshopify.com",
          },
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors https://admin.myshopify.com",
          },
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors " + shop,
          },
        ],
      },
    ];
  },
});
