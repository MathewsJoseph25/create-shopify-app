# create-shopify-app
This project requires you to have Bun and Docker installed on your local machine.

To install dependencies:

```bash
bun install
```

To run:

1. Initiate a tunneling tool on your local machine (we recommend Cloudflare tunnels or ngrok). You'll get a tunneled url from any of those services. We'll call it TUNNEL_URL from here.
2. Create an App on shopify partner portal.
3. Update the shopify app url to {{TUNNEL_URL}}/auth/auth-init
4. Add 2 callback urls to the app: {{TUNNEL_URL}}/auth/auth-callback and {{TUNNEL_URL}}/billing/billing-callback
5. Create an `.env` file at the root of the project and update the env variable according to env.exmaple.
6. Run `docker-compose up` at the root of the folder
