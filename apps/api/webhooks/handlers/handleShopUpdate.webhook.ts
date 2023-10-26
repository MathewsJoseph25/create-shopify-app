import { ShopsModel } from '@/services/auth/models/shop.model'

export const handleShopUpdateWebhook = async (payload: any, shop: string) => {
  try {
    await ShopsModel.findOneAndUpdate(
      {
        shop,
      },
      { info: payload },
    )
  } catch (error) {
    console.log('Error on Webhook - Shop Update: ', error, { shop })
  }
}
