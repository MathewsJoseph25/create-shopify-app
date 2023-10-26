import { SHOPIFY_API_VERSION } from '@/config'
import axios from 'axios'
import { trackException } from './trackException.util'
import { ShopsModel } from '@/services/auth/models/shops.model'

export const fetchShopifyApi = async <T>(
  shop: string,
  url: string,
  data?: any,
  method = 'GET',
) => {
  try {
    const shopData = await ShopsModel.findOne({ shop })
    if (!shopData || !shopData.accessToken)
      throw new Error("Shop isn't installed")

    const request = await axios<T>({
      url: `https://${shop}.myshopify.com/admin/api/${SHOPIFY_API_VERSION}${url}`,
      data,
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': shopData.accessToken,
      },
    })
    return request.data
  } catch (error) {
    trackException('Error during shopify request: ', error, { shop })
    throw error
  }
}
