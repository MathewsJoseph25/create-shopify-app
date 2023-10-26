import { Request, Response } from 'express'

export interface RouteHandler {
  (req: Request, res: Response): void
  isShopifyAuthRequired?: boolean
}
