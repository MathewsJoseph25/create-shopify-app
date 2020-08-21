const Shop = require("../../../models/shop");
//function to add Webhooks to the store and set data to the database
const shopUpdate = async (payload, shop) => {
  try {
    await Shop.findOneAndUpdate(
      {
        shop: shop.replace("https://", "").replace("http://", "").split(".")[0],
      },
      { info: payload }
    );
  } catch (error) {
    console.log("Error while Webhook - Shop Update");
    console.log(error);
  }
};

module.exports = shopUpdate;
