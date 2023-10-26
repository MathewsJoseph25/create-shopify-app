import { SHOPIFY_API_VERSION } from '@/config'
import { ShopsModel } from '@/services/auth/models/shops.model'
import { trackException } from '@/utils/trackException.util'
import axios from 'axios'

//Handling  incomming webhooks
export const handleAppUninstallWebhook = async (payload: any, shop: string) => {
  //checking if the app is really uninstalled because if someone installes, uninstalls and reinstalls quickly (shopify bots, maybe),
  //we may get the webhook after the 2nd install is completed and so, we don't want to remove the access token in that case
  try {
    let shopData = await ShopsModel.findOne({ shop })

    if (!shopData) throw new Error('Shop not installed')
    //Store lookup
    const header = {
      'X-Shopify-Access-Token': shopData.accessToken,
    }
    const info = await axios({
      url: `https://${shop}.myshopify.com/admin/api/${SHOPIFY_API_VERSION}/shop.json`,
      headers: header,
    })

    //if we have 'shop' in the returned data, then, the store is installed and so, don't remove data from database
    if (info.data.shop) {
      trackException('Received Uninstall Webhook from Installed Store!', {
        shop,
      })
      return
    }
  } catch (error) {
    //If the shop isn't installed, Shopify returns 401 and Axios will throw an unauthenticated request error
    //So, we can now remove the data from the database
  }

  try {
    await ShopsModel.findOneAndUpdate(
      {
        shop,
      },
      {
        accessToken: null,
        scopes: '',
        billingPlan: null,
        isInstalled: false,
        uninstalledOn: new Date(),
      },
    )
  } catch (error) {
    trackException('Error while handling webhook: app/uninstalled', error, {
      shop,
    })
  }
}
