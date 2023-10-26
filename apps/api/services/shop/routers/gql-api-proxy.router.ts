import { RouteHandler } from '@/types'
import { fetchShopifyApi } from '@/utils/fetchShopifyApi.util'
import { Request, Response } from 'express'

export const handler: RouteHandler = async (req: Request, res: Response) => {
  console.log('here')
  const { query, variables } = req.body
  const gqlResponse = await fetchShopifyApi(
    res.locals.shop,
    '/graphql.json',
    {
      query,
      variables,
    },
    'POST',
  )
  return res.json(gqlResponse)
}

handler.isShopifyAuthRequired = true
