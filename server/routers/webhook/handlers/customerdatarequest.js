const Shop = require("../../../models/shop");
//function to add Webhooks to the store and set data to the database
const customerDataRequest = async (payload, shop) => {
  try {
    let doc = await Shop.findOne(shop);
    return doc;
  } catch (error) {
    console.log("Error while Webhook - Shop Update ::", error);
  }
};

module.exports = customerDataRequest;
