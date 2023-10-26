import { Request, Response } from 'express'
import { verifyWebhook } from './helpers/verifyWebhook.helper'
import { ERROR_CODES } from '@/constants'
import { handleAppUninstallWebhook } from './handlers/handleAppUninstall.webhook'
import { handleShopUpdateWebhook } from './handlers/handleShopUpdate.webhook'

export const ShopifyWebhooksHandler = (req: Request, res: Response) => {
  // Verify webhook
  const hmac = req.header('X-Shopify-Hmac-Sha256') as string
  const topic = req.header('X-Shopify-Topic') as string
  const shop = (req.header('X-Shopify-Shop-Domain') as string)
    ?.replace('https://', '')
    .replace('http://', '')
    .split('.')[0]

  const verified = verifyWebhook(req.body, hmac)

  if (!verified) {
    res
      .status(ERROR_CODES.UNAUTHENTICATED_REQUEST)
      .send('Could not verify Webhook request.')
    return
  }

  const data = req.body.toString()
  const payload = JSON.parse(data)
  res.status(200).send('OK')

  switch (topic) {
    case 'app/uninstalled':
      handleAppUninstallWebhook(payload, shop)
      break
    case 'shop/update':
      handleShopUpdateWebhook(payload, shop)
      break
  }
}
