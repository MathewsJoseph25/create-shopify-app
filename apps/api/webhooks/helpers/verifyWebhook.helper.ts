import { getShopifyAuthKeys } from '@/services/auth/helpers/getShopifyAuthKeys.helper'
import crypto from 'crypto'
// Verify incoming webhook.
export const verifyWebhook = (shop: string, payload: any, hmac: string) => {
  const { SHOPIFY_API_SECRET_KEY } = getShopifyAuthKeys(shop)
  const message = payload.toString()
  const genHash = crypto
    .createHmac('sha256', SHOPIFY_API_SECRET_KEY!)
    .update(message)
    .digest('base64')
  return genHash === hmac
}
