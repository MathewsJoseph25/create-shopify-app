import { CUSTOM_APP_CREDENTIALS } from '@app/common'

export const getShopifyAuthKeys = (shop: string) => {
  if (CUSTOM_APP_CREDENTIALS[shop]) {
    return CUSTOM_APP_CREDENTIALS[shop]
  }
  return {
    SHOPIFY_API_KEY: process.env.NEXT_PUBLIC_SHOPIFY_API_KEY,
    SHOPIFY_API_SECRET_KEY: process.env.SHOPIFY_API_SECRET_KEY,
  } as {
    SHOPIFY_API_KEY: string
    SHOPIFY_API_SECRET_KEY: string
  }
}
