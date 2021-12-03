const Shop = require("../../../models/shop");
// const nonceCreate = require("nonce")();

const serialDetail = async (shop) => {
  try {
    let doc = await Shop.findOne(shop);
    return doc;
  } catch (error) {
    console.log("Error while fetching Registered serial from Database: ", error);
    return false;
  }
};

module.exports = serialDetail;
