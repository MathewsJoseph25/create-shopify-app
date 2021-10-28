const Shop = require("../../../models/shop");
const axios = require("axios");

//Handling  incomming webhooks
const appUninstall = async (payload, shop) => {
  //checking if the app is really uninstalled because if someone installes, uninstalls and reinstalls quickly,
  //we may get the webhook after the 2nd install is completed and so, we don't want to remove the access token in that case

  try {
    let shopFromDatabase = await Shop.findOne({
      shop: shop.replace("https://", "").replace("http://", "").split(".")[0],
    });
    //Store lookup
    const header = {
      "X-Shopify-Access-Token": shopFromDatabase.accessToken,
    };
    const info = await axios({
      url:
        "https://" +
        shop.replace("https://", "").replace("http://", "").split(".")[0] +
        ".myshopify.com/admin/api/" +
        API_VERSION +
        "/shop.json",
      headers: header,
    });

    //if we have 'shop' in the returned data, then, the store is installed and so, don't remove data from database
    if (info.data.shop) {
      console.log("Uninstall Webhook from Installed Store Received!");
      return;
    }
  } catch (error) {
      console.log(error);
    //If the shop isn't installed, Shopify returns 401 and Axios will throw an unauthenticated request error
    //So, we can now remove the data from the database
  }

  try {
    await Shop.findOneAndUpdate(
      {
        shop: shop.replace("https://", "").replace("http://", "").split(".")[0],
      },
      {
        uninstalledOn: Date.now(),
        isInstalled: false,
        accessToken: null,
        webhooks: {},
      }
    );
  } catch (error) {
    console.log("Error while Webhook - Shop Uninstall", error);
  }
};

module.exports = appUninstall;
