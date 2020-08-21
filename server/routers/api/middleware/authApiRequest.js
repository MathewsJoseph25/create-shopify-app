const crypto = require("crypto");

//Middleware for verifying Api Requests
const authApiRequest = (req, res, next) => {
  if (req.header("Authorization")) {
    const auth = req.header("Authorization");
    //Extracting the data
    let [header, payload, signature] = auth.split(".");

    //Verifying the auth
    const checkhmac = decodeURI(header + "." + payload);
    const genHash = crypto
      .createHmac("sha256", SHOPIFY_API_SECRET_KEY)
      .update(checkhmac)
      .digest("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/g, "");
    if (genHash === signature) {
      header = JSON.parse(Buffer.from(header, "base64"));
      payload = JSON.parse(Buffer.from(payload, "base64"));

      //Getting current time to verfity the auth timestamp limits
      const cTime = Date.now() / 1000;
      //verifying payload
      if (
        payload.exp < cTime ||
        payload.nbf > cTime ||
        payload.iss.replace("https://", "").split(".")[0] !=
          payload.dest.replace("https://", "").split(".")[0] ||
        payload.aud != SHOPIFY_API_KEY
      ) {
        return res.json({ error: "Token Verification Failed" });
      }

      //JWT Verified!
      res.locals.shop = payload.dest;
      next();
    } else {
      res.json({
        error: "Token Verification Failed",
      });
    }
  } else {
    res.json({ error: "Unauthorized Request" });
  }
};

module.exports = authApiRequest;
