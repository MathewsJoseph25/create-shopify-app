import { RouteHandler } from '@/types'
import { Request, Response } from 'express'
import { verifyUrlHMAC } from '../helpers/verifyShopifyUrlHmac.helper'
import { ERROR_CODES } from '@/constants'
import { ShopsModel } from '../models/shop.model'
import {
  SHOPIFY_ADMIN_APP_URL,
  SHOPIFY_API_KEY,
  SHOPIFY_API_SECRET_KEY,
  SHOPIFY_API_VERSION,
} from '@/config'
import axios from 'axios'
import { addShopifyWebhooks } from '../helpers/addShopifyWebhooks.helper'

export const handler: RouteHandler = async (req: Request, res: Response) => {
  //verify the request
  if (!verifyUrlHMAC(req)) {
    return res
      .status(ERROR_CODES.UNAUTHENTICATED_REQUEST)
      .send('Unauthenticated request!')
  }

  const shop = (req.query.shop as string)
    .replace('https://', '')
    .replace('http://', '')
    .split('.')[0]
  const { state, code, host } = req.query

  //check nonce value
  const shopData = await ShopsModel.findOne({ shop })

  if (!shopData || state != shopData.nonce) {
    return res
      .status(ERROR_CODES.UNAUTHENTICATED_REQUEST)
      .send('Unauthenticated Request')
  }

  //get access token from shopify and save to db
  const body = {
    client_id: SHOPIFY_API_KEY,
    client_secret: SHOPIFY_API_SECRET_KEY,
    code,
  }

  const getAccessToken = await axios({
    method: 'post',
    url: `https://${shop}.myshopify.com/admin/oauth/access_token`,
    data: body,
  })

  const { access_token, scope } = getAccessToken.data

  const authHeader = {
    'X-Shopify-Access-Token': access_token,
  }
  const getShopInfo = await axios({
    url: `https://${shop}.myshopify.com/admin/api/${SHOPIFY_API_VERSION}/shop.json`,
    headers: authHeader,
  })

  const currentDate = new Date()
  shopData.accessToken = access_token
  shopData.scopes = scope
  shopData.info = getShopInfo.data.shop
  shopData.installedOn = currentDate
  shopData.isInstalled = true
  shopData.uninstalledOn = null

  //save
  await shopData.save()

  //now add the webhooks we need to this shop
  await addShopifyWebhooks(shop, access_token, [
    'app/uninstalled',
    'shop/update',
  ])

  const return_to = req.query.return_to || ''
  res.redirect(
    `${SHOPIFY_ADMIN_APP_URL}/${return_to}?shop=${shop}.myshopify.com&host=${host}`,
  )
}
