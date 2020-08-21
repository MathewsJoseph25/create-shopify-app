const Shop = require("../models/shop");
const getInstallUrl = require("../routers/auth/helpers/getInstallUrl");

const checkShop = async (req, res, next) => {
  //check if shop param is present on the url
  if (req.query.shop && req.query.shop.indexOf("myshopify") != -1) {
    req.query.shop = req.query.shop
      .replace("https://", "")
      .replace("http://", "")
      .split(".")[0];

    //check if shop is installed
    try {
      var shop = await Shop.findOne({ shop: req.query.shop });
    } catch (error) {
      console.log("Error when Store lockup on database: ", error);
      res.send("An Error Occurred! Please go back and try again");
    }
    if (shop && shop.isInstalled) {
      next();
    } else {
      //Redirect to install url if shop isn't installed.
      try {
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
    }
  } else {
    //let the customer know to add the shop parameter
    res.send("shop param missing/invalid. Please add that param");
  }
};

module.exports = checkShop;
