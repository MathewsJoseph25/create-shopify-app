import { RouteHandler } from '@/types'
import { Request, Response } from 'express'
import { ShopsModel } from '../models/shops.model'

export const handler: RouteHandler = async (req: Request, res: Response) => {
  const shopData = await ShopsModel.findOne({ shop: res.locals.shop })
  res.json({
    info: shopData?.info,
    subscriptionData: shopData?.subscriptionData,
  })
}

handler.isShopifyAuthRequired = true
