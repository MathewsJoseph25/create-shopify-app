import { RouteHandler } from '@/types'
import { fetchShopifyApi } from '@/utils/fetchShopifyApi.util'
import { Request, Response } from 'express'

export const handler: RouteHandler = async (req: Request, res: Response) => {
  const { url, method, data } = req.body
  const restResponse = await fetchShopifyApi(res.locals.shop, url, data, method)
  return res.json(restResponse)
}

handler.isShopifyAuthRequired = true
