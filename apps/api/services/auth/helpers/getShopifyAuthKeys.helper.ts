import { CUSTOM_APP_API_SECRET_KEY } from '@/customAppApiSecretKeys'
import { CUSTOM_APP_API_KEY } from '@app/common'

export const getShopifyAuthKeys = (shop: string) => {
  if (CUSTOM_APP_API_KEY[shop]) {
    return {
      SHOPIFY_API_KEY: CUSTOM_APP_API_KEY[shop],
      SHOPIFY_API_SECRET_KEY: CUSTOM_APP_API_SECRET_KEY[shop],
    } as {
      SHOPIFY_API_KEY: string
      SHOPIFY_API_SECRET_KEY: string
    }
  }
  return {
    SHOPIFY_API_KEY: process.env.NEXT_PUBLIC_SHOPIFY_API_KEY,
    SHOPIFY_API_SECRET_KEY: process.env.SHOPIFY_API_SECRET_KEY,
  } as {
    SHOPIFY_API_KEY: string
    SHOPIFY_API_SECRET_KEY: string
  }
}
