import dotenv from 'dotenv'
dotenv.config()

//setting timezone to UTC
process.env.TZ = 'utc'

export const SHOPIFY_API_KEY = process.env.NEXT_PUBLIC_SHOPIFY_API_KEY
export const SHOPIFY_API_SECRET_KEY = process.env.SHOPIFY_API_SECRET_KEY
export const SHOPIFY_ADMIN_APP_URL = process.env.SHOPIFY_ADMIN_APP_URL
export const SHOPIFY_AUTH_REDIRECT_URL = process.env.SHOPIFY_AUTH_REDIRECT_URL
export const SHOPIFY_SUBSCRIPTION_REDIRECT_URI =
  process.env.SHOPIFY_SUBSCRIPTION_REDIRECT_URI
export const SHOPIFY_WEBHOOK_URL = process.env.SHOPIFY_WEBHOOK_URL
export const SHOPIFY_API_VERSION = '2023-07'
export const SHOPIFY_ACCESS_SCOPES = 'write_products'
export const SHOPIFY_DEV_STORE_PLANS = [
  'partner_test',
  'plus_partner_sandbox',
  'affiliate',
]

export const MONGODB_CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING

if (
  !SHOPIFY_API_KEY ||
  !SHOPIFY_API_SECRET_KEY ||
  !SHOPIFY_ADMIN_APP_URL ||
  !SHOPIFY_AUTH_REDIRECT_URL ||
  !SHOPIFY_WEBHOOK_URL
) {
  //required env variables not specified
  console.error(
    'Required env value(s) not specified. Check config.ts for the required values',
  )
  process.exit()
}
