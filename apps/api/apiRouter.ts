import { Request, Response } from 'express'
import { RouteHandler } from './types'
import { ERROR_CODES } from './constants'
import { trackException } from './utils/trackException.util'
import crypto from 'crypto'
import { getShopifyAuthKeys } from './services/auth/helpers/getShopifyAuthKeys.helper'

declare global {
  namespace Express {
    interface Locals {
      shop: string
    }
  }
}

export const urlRouter = async (req: Request, res: Response) => {
  const urlStructure = req.path.split('/')
  //remove the empty first string on the array
  urlStructure.splice(0, 1)
  const service = urlStructure.splice(0, 1)[0]

  try {
    const { handler }: { handler: RouteHandler } = await import(
      `./services/${service}/routers/${urlStructure.join('/')}.router.ts`
    )

    const authHeader = req.header('Authorization')
    if (authHeader) {
      //Extracting the data
      let [header, payload, signature] = authHeader.split('.')

      const payloadData = JSON.parse(Buffer.from(payload, 'base64').toString())
      const shop = payloadData.dest.replace('https://', '').split('.')[0]

      const { SHOPIFY_API_KEY, SHOPIFY_API_SECRET_KEY } =
        getShopifyAuthKeys(shop)
      //Verifying the auth
      const checkhmac = decodeURI(header + '.' + payload)
      const genHash = crypto
        .createHmac('sha256', SHOPIFY_API_SECRET_KEY!)
        .update(checkhmac)
        .digest('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/g, '')

      if (genHash === signature) {
        //Getting current time to verfity the auth timestamp limits
        const cTime = Date.now() / 1000

        //verifying payload
        if (
          payloadData.exp >= cTime &&
          payloadData.nbf <= cTime &&
          payloadData.iss.replace('https://', '').split('.')[0] ==
            payloadData.dest.replace('https://', '').split('.')[0] &&
          payloadData.aud == SHOPIFY_API_KEY
        ) {
          //token verified
          res.locals.shop = shop
        }
      }
    }

    if (handler.isShopifyAuthRequired && !res.locals.shop) {
      return res
        .status(ERROR_CODES.UNAUTHENTICATED_REQUEST)
        .send('Unauthenticated request!')
    }

    handler(req, res)
  } catch (error: any) {
    if (error.code == 'ERR_MODULE_NOT_FOUND')
      res
        .status(ERROR_CODES.NO_DATA_AVAILABLE)
        .json({ error: 'Given path not found' })
    else {
      res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).json({
        error: 'Oops! Something went wrong on our end. Please try again. ',
      })
      trackException('Error handling Request: ', error)
    }
  }
}
