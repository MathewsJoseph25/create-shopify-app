const crypto = require("crypto");
const querystring = require("querystring");

const verifyUrlHMAC = (req) => {
  const q = querystring.unescape(req.originalUrl).split("?");
  let s = q[1].split("&");
  let check = "";
  for (var i = 0; i < s.length; i++) {
    if (s[i].indexOf("hmac") == -1) {
      check += s[i] + "&";
    }
  }
  let urlToCheck = check.slice(0, -1);
  let hashToCheck = crypto
    .createHmac("SHA256", SHOPIFY_API_SECRET_KEY)
    .update(urlToCheck)
    .digest("hex");
  return hashToCheck == req.query.hmac;
};

module.exports = verifyUrlHMAC;
