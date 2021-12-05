const api = require("express").Router();
const authApiRequest = require("./middleware/authApiRequest");
const registration = require("../api/helpers/registration");
const serialDetail = require("./helpers/serialdetail");

//api authentication
// api.use(authApiRequest);

//Api Routes
api.get("/1", (req, res) => {
  res.json({ hi: "from first api" });
});
api.get("/2", (req, res) => {
  res.json({ hi: "from second api" });
});
api.get("/shop", async (req, res) => {
  try {
    var shop = req.query.shop
      .replace("https://", "")
      .replace("http://", "")
      .split(".")[0];
    var shopResult = await serialDetail({ shop });
    console.log(shopResult.process)
    let resData = {
      serial: shopResult.serial,
      process: shopResult.process
    }
    res.json({ success: true, data: resData }).status(200);
  } catch (e) {
    console.log(e);
    res.json({ success: false }).status(500);
  }
  // res.json(shopResult);
});
api.post("/regform", async (req, res) => {
  //res.json({serial: '123'})
  console.log("in api call");
  console.log(req);
  try {
    let registrationRes = await registration(
      req.body.shop
        .replace("https://", "")
        .replace("http://", "")
        .split(".")[0],
      req.body.serialNumber
    );
    // console.log("registration :: ", registrationRes);
  } catch (e) {
    console.log(e);
  }
  res.status(200).send("Addedd successfully");
});
module.exports = api;
