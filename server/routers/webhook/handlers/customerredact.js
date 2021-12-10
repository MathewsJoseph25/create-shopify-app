const Shop = require("../../../models/shop");
//function to add Webhooks to the store and set data to the database
const customerRedact = async (payload, shop) => {
  try {
    await Shop.findOneAndDelete(
      {
        shop: shop.replace("https://", "").replace("http://", "").split(".")[0],
      },
      async (err, shop) => {
        if ((err === null && shop === null) || shop === null) {
          return;
        } else {
          console.log(err);
          return;
        }
      }
    );
  } catch (error) {
    console.log("Error while Webhook - Shop Update ::", error);
  }
};

module.exports = customerRedact;
