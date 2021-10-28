const api = require("express").Router();
const authApiRequest = require("./middleware/authApiRequest");

//api authentication
api.use(authApiRequest);

//Api Routes
api.get("/1", (req, res) => {
  res.json({ hi: "from first api" });
});
api.get("/2", (req, res) => {
  res.json({ hi: "from second api" });
});
api.post("/regform", (req, res) => {
  res.json({serial: serialNum})
})
module.exports = api;
