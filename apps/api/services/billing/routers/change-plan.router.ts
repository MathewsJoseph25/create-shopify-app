import { SHOPIFY_SUBSCRIPTION_REDIRECT_URI } from '@/config'
import { ERROR_CODES } from '@/constants'
import { ShopsModel } from '@/services/auth/models/shops.model'
import { RouteHandler } from '@/types'
import { fetchShopifyApi } from '@/utils/fetchShopifyApi.util'
import { BillingPlan } from '@app/common'
import { Request, Response } from 'express'

export const handler: RouteHandler = async (req: Request, res: Response) => {
  const { billingPlan, host }: { billingPlan: BillingPlan; host: string } =
    req.body

  if (!billingPlan)
    return res
      .status(ERROR_CODES.BAD_REQUEST)
      .json({ error: 'Billing plan not found' })

  //see if they're downgrading to free plan instead of upgrading.
  if (billingPlan.sku == 'free') {
    //cancel the billing plan and send back the success message
    const shopData = await ShopsModel.findOne({ shop: res.locals.shop })
    if (!shopData || !shopData?.subscriptionData) {
      return res
        .status(ERROR_CODES.UNPROCESSABLE_ENTITY)
        .json({ error: "Shop or current billing plan doesn't exist" })
    }

    //cancel the charge on shopify
    await fetchShopifyApi(
      res.locals.shop,
      `/recurring_application_charges/${shopData.subscriptionData.chargeId}.json`,
    )

    //mark as cancelled on our db
    shopData.subscriptionData = null
    await shopData.save()
    return res.json({ msg: 'Downgraded to free plan.' })
  }

  //now upgrade to a paid plan
  const createCharge = await fetchShopifyApi<{
    recurring_application_charge: {
      id: number
      confirmation_url: string
    }
  }>(
    res.locals.shop,
    `/recurring_application_charges.json`,
    {
      recurring_application_charge: {
        name: billingPlan.name,
        price: billingPlan.price,
        return_url: `${SHOPIFY_SUBSCRIPTION_REDIRECT_URI}?shop=${res.locals.shop}&host=${host}`,
        trial_days: 14,
        test: process.env.DEV == 'true',
      },
    },
    'POST',
  )

  //give back the confirmation url to the frotend
  res.json({
    confirmationUrl: createCharge.recurring_application_charge.confirmation_url,
  })
}

handler.isShopifyAuthRequired = true
