const Shop = require("../../../models/shop");
//function to add Webhooks to the store and set data to the database
const customerDataRequest = async (payload, shop) => {
  try {
    let doc = await Shop.findOne({
      shop: shop.replace("https://", "").replace("http://", "").split(".")[0],
    });
    return doc;
  } catch (error) {
    console.log("Error while Webhook - Shop Update ::", error);
  }
};

module.exports = customerDataRequest;
