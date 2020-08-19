# create-shopify-app

## Create Shopify App With JWT Authentication

### Using NodeJs, React, Shopify Polaris and MongoDB

#### NOTE: This isn't an official Shopify repository.

This project aims at creating a basic FREE Shopify App to install on a shopify store, with webhooks set for both shop/update and app/uninstalled.

The project is divided into 8 parts:

- **PART 1**: Initialization of objects
- **PART 2**: Serving static assets without auth
- **PART 3**: Functions for adding webhook to shop, verifying incoming webhook, handling webhook,
  verifying URL HMAC, generating redirect url to install the app and middleware for verifying Api Requests.
- **PART 4**: Handling webhook route
- **PART 5**: Handling Authentication Routes
- **PART 6**: Handling API routes
- **PART 7**: Handling Un-Authenticated App Page routes
- **PART 8**: NextJS Preparing and Server Listening

Basic overview of the app:

- Database - MongoDB (You can also use MongoDB atlas)
- Authentication - Shopify JWT
- Supports 2 environments - You need to update the **.env** file with the required values. Those variables starting with **DEV** should be used to set Development App Credentials and those starting with **PROD** should be used to set Production App Credentials. You can get started by setting the **DEV** variables only, since the **PROD** variables will be used only on the production environment, a.k.a, on the server where you're planning to host the app
- Contains 2 pages with loading indicators and both pages fetches data from different API urls when you press on the **Fetch Api** button, to demonstrate how API works
- All Api Routes are handled on a separate api.js file

How to get started:

1. Clone this repository
2. Run "npm install" to install dependencies
3. Update the environment variables on the .env file
4. Start a node server (npm run dev) and a ngrok instance (ngrok http 3000) on separate terminals and take note of the ngrok https url for the next step
5. Update app urls (main and whitelisted callbacks) on the partner dashboard. \
   on main url use https://{ngrok-host-name}/auth \
   on whitelisted callbacks use https://{ngrok-host-name}/auth/callback
6. Install the app on a development store from your partner dashboard
