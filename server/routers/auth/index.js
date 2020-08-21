const auth = require("express").Router();
const axios = require("axios");

//Auth init route
auth.get("/", require("./init"));

//auth callback route
auth.get("/callback", require("./callback"));

module.exports = auth;
