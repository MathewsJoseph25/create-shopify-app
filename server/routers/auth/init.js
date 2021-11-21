const axios = require("axios");
const Shop = require("../../models/shop");
const getInstallUrl = require("./helpers/getInstallUrl");
const registration = require("./helpers/registration");
const init = async (req, res) => {
  //check if shop param is present on the url
  if (req.query.shop && req.query.shop.indexOf("myshopify") != -1) {
    req.query.shop = req.query.shop
      .replace("https://", "")
      .replace("http://", "")
      .split(".")[0];

    //check if shop is installed
    let shop;
    try {
      shop = await Shop.findOne({ shop: req.query.shop });
    } catch (error) {
      console.log("Error while Store lockup on database during auth: ", error);
      res.send("An Error Occurred! Please go back and try again");
      return;
    }

    if (shop && shop.isInstalled) {
      /*
      We have shop data in our database, but if a customer uninstalls and try to reinstall the app quickly, 
      then, we may not have got the uninstall webhook yet and so, we may think that the shop is installed,
      but, it isn't. To solve this problem, we'll request the shop info from shopify using the auth token that 
      we have on our database. So, if the shop has been uninstalled, we'll not get the shop data and so, we can confirm
      in that case that our app isn't installed and so, we can redirect to the install url. 
      
      When the app is installed, this auth phase only happens on the first app load and all subsequest loads doesn't have
      to go through this store lookup process again and so, it won't add latency to future calls to our server from the store.
      */

      //Store lookup
      try {
        const header = {
          "X-Shopify-Access-Token": shop.accessToken,
        };
        const info = await axios({
          url:
            "https://" +
            req.query.shop +
            ".myshopify.com/admin/api/" +
            API_VERSION +
            "/shop.json",
          headers: header,
        });

        //if we have 'shop' in the returned data, the store is installed
        if (info.data.shop) {
          //redirect to index page with the shop param to serve the app
          const url = "/?shop=" + req.query.shop + ".myshopify.com";
          res.redirect(url);
          return;
        }
      } catch (error) {
        //If the shop isn't installed, Shopify returns 401 and Axios will throw an unauthenticated request error
        //So, we need to redirect to the install url.
      }
    }

    //Redirect to install url as shop isn't installed.
    try {
      console.log("req ::",req);
      console.log('req.query.shop  ::', req.query.shop)
      let installUrl = await getInstallUrl(
        req.query.shop
          .replace("https://", "")
          .replace("http://", "")
          .split(".")[0]
      );
      if (installUrl) res.redirect(installUrl);
      else res.send("An Error Occurred! Please go back and try again.");
    } catch (error) {
      console.log("Error when generating redirect url for install: ", error);
      res.send("An Error Occurred! Please go back and try again");
    }
  } else {
    //ask the customer to add the shop parameter
    res.send("shop param missing/invalid. Please add that param");
  }
};

module.exports = init;
