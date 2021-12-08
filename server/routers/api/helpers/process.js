const Shop = require("../../../models/shop");
const nonceCreate = require("nonce")();

const process = async (shop, process) => {
  // console.log(shop);
  // console.log(process);
  let nonce = nonceCreate();
  try {
    await Shop.findOneAndUpdate(
      { shop: shop },
      { $push: { process: process } },
      { returnNewDocument: true },
    );
  } catch (error) {
    console.log("Error while adding Proess to Database: ", error);
    return false;
  }
  return (
    "https://" +
    shop +
    ".myshopify.com/admin/oauth/authorize?client_id=" +
    SHOPIFY_API_KEY +
    "&scope=" +
    SCOPES +
    "&redirect_uri=" +
    SHOPIFY_REDIRECT_URI +
    "&state=" +
    nonce
  );
};

module.exports = process;
