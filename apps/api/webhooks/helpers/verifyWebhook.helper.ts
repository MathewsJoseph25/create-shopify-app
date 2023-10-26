import { SHOPIFY_API_SECRET_KEY } from '@/config'
import crypto from 'crypto'
// Verify incoming webhook.
export const verifyWebhook = (payload: any, hmac: string) => {
  const message = payload.toString()
  const genHash = crypto
    .createHmac('sha256', SHOPIFY_API_SECRET_KEY!)
    .update(message)
    .digest('base64')
  return genHash === hmac
}
