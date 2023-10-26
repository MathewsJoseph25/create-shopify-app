import { ShopsModel } from '@/services/auth/models/shops.model'
import { trackException } from '@/utils/trackException.util'

export const handleShopUpdateWebhook = async (payload: any, shop: string) => {
  try {
    await ShopsModel.findOneAndUpdate(
      {
        shop,
      },
      { info: payload },
    )
  } catch (error) {
    trackException('Error on Webhook - Shop Update: ', error, { shop })
  }
}
