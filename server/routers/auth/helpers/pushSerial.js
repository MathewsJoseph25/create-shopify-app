// const Shop = require("../../../models/shop");
// const getInstallUrl = require("./getInstallUrl");
const nonceCreate = require("nonce")();

const pushSerial = async (shop) => {
  let nonce = nonceCreate();
  let serial = serialNum
  try {
    await Shop.updateOne(
      { shop: shop },
      { shop: shop, serial: serial},
      { upsert: true }
    );
  } catch (error) {
    console.log("Error while adding Nonce to Database: ", error);
    return false;
  }
  return ( getInstallUrl
    // "https://" +
    // shop +
    // ".myshopify.com/admin/oauth/authorize?client_id=" +
    // SHOPIFY_API_KEY +
    // "&scope=" +
    // SCOPES +
    // "&redirect_uri=" +
    // SHOPIFY_REDIRECT_URI +
    // "&state=" +
    // nonce
  );
};

module.exports = pushSerial;
