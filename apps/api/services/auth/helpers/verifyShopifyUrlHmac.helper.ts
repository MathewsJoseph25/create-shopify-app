import { Request } from 'express'
import querystring from 'querystring'
import crypto from 'crypto'
import { getShopifyAuthKeys } from './getShopifyAuthKeys.helper'

export const verifyUrlHMAC = (req: Request) => {
  const q = querystring.unescape(req.originalUrl).split('?')
  const { SHOPIFY_API_SECRET_KEY } = getShopifyAuthKeys(
    (req.query.shop as string)?.split('.')[0],
  )
  let s = q[1].split('&')
  let params = []
  for (var i = 0; i < s.length; i++) {
    if (s[i].indexOf('hmac') == -1) {
      params.push(s[i])
    }
  }
  params.sort()
  let urlToCheck = params.join('&')
  let hashToCheck = crypto
    .createHmac('SHA256', SHOPIFY_API_SECRET_KEY!)
    .update(urlToCheck)
    .digest('hex')
  return hashToCheck == req.query.hmac
}
