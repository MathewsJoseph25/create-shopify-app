const api = require("express").Router();
const authApiRequest = require("./middleware/authApiRequest");
const registration = require("../api/helpers/registration");

//api authentication
//api.use(authApiRequest);

//Api Routes
api.get("/1", (req, res) => {
  res.json({ hi: "from first api" });
});
api.get("/2", (req, res) => {
  res.json({ hi: "from second api" });
});
api.post("/regform", async (req, res) => {
  //res.json({serial: '123'})
  console.log('in api call');
  console.log(req);
  try {
    let registrationRes = await registration(
      req.body.shop
        .replace("https://", "")
        .replace("http://", "")
        .split(".")[0], req.body.serialNumber
    );
    console.log("registration :: ", registrationRes);
  } catch (e) {
    console.log(e);
  }
res.status(200).send("Addedd successfully");
})
module.exports = api;
