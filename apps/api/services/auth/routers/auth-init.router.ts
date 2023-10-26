import { RouteHandler } from '@/types'
import { Request, Response } from 'express'
import { ShopsModel } from '../models/shops.model'
import axios from 'axios'
import { SHOPIFY_ACCESS_SCOPES, SHOPIFY_ADMIN_APP_URL } from '@/config'
import { getShopInstallUrl } from '../helpers/getShopInstallUrl.helper'

export const handler: RouteHandler = async (req: Request, res: Response) => {
  const { redirectPath } = req.query
  const shop = (req.query.shop as string)
    ?.replace('https://', '')
    .replace('http://', '')
    .split('.')[0]

  if (!shop)
    return res.send('shop param missing/invalid. Please add that param')

  //check if shop is already installed or not
  const shopData = await ShopsModel.findOne({ shop })

  if (shopData && shopData.isInstalled) {
    /**
     * To avoid race condition where customer has uninstalled our app but we haven't received the uninstall webhook,
     * we'll check with Shopify again using the access token on see if our access token is valid or not.
     * At the same time, if we need more access scopes than what we were granted initially on install,
     * we would again redirect to the install screen to approve new scopes
     */

    const authHeader = {
      'X-Shopify-Access-Token': shopData.accessToken,
    }

    const getAccessScopes = await axios({
      url: `https://${shop}.myshopify.com/admin/oauth/access_scopes.json`,
      headers: authHeader,
    })

    //if we have 'access_scopes' in the returned data, the store is installed
    if (getAccessScopes?.data?.access_scopes) {
      //check to see if the app has all our current required access scopes.
      let requiredScopes = SHOPIFY_ACCESS_SCOPES.split(',')
      let givenAccessScopes = getAccessScopes?.data?.access_scopes

      let isReAuthRequired = false

      for (let index = 0; index < requiredScopes.length; index++) {
        const scope = requiredScopes[index]
        if (
          givenAccessScopes.findIndex(
            (s: { handle: string }) => s.handle == scope,
          ) == -1
        ) {
          isReAuthRequired = true
        }
      }

      let url = `${SHOPIFY_ADMIN_APP_URL}${
        redirectPath || ''
      }?shop=${shop}.myshopify.com&host=${req.query.host}`

      if (isReAuthRequired) {
        let installUrl = await getShopInstallUrl(shop)
        url += `&redirect=${encodeURIComponent(installUrl)}`
      }
      return res.redirect(url)
    }
  }

  const installUrl = await getShopInstallUrl(shop)
  res.redirect(installUrl)
}
