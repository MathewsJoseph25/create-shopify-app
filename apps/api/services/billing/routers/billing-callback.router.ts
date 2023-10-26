import { ERROR_CODES } from '@/constants'
import { ShopsModel } from '@/services/auth/models/shops.model'
import { RouteHandler } from '@/types'
import { fetchShopifyApi } from '@/utils/fetchShopifyApi.util'
import { runInTransaction } from '@/utils/runInTransaction.util'
import { BILLING_PLANS, SHOP_SUBSCRIPTION_STATUS } from '@app/common'
import { Request, Response } from 'express'
import { ShopSubscriptionDataModal } from '../models/shopSubscriptionData.model'
import { SHOPIFY_ADMIN_APP_URL } from '@/config'

export const handler: RouteHandler = async (req: Request, res: Response) => {
  const { shop, charge_id, host } = req.query
  if (!shop || !charge_id) {
    return res
      .status(ERROR_CODES.UNPROCESSABLE_ENTITY)
      .json({ error: 'Shop or charge id not found' })
  }

  //now check the charge id from shopify
  const chargeStatus = await fetchShopifyApi<{
    recurring_application_charge: {
      status: string
      name: string
      price: string
    }
  }>(shop as string, `/recurring_application_charges/${charge_id}.json`)

  if (chargeStatus.recurring_application_charge.status != 'active') {
    //return error as this charge is not active
    return res
      .status(ERROR_CODES.UNPROCESSABLE_ENTITY)
      .json({ error: 'Invalid charge id provided' })
  }

  //find the plan to which we need to uprade
  const billingPlan = BILLING_PLANS.find(
    (plan) => plan.name == chargeStatus.recurring_application_charge.name,
  )
  if (!billingPlan)
    return res
      .status(ERROR_CODES.NO_DATA_AVAILABLE)
      .json({ error: 'Billing plan not found' })

  // now upgrade the store
  await runInTransaction(async (session) => {
    //first cancell all current active billing plans
    await ShopSubscriptionDataModal.updateMany(
      { shop },
      { $set: { status: SHOP_SUBSCRIPTION_STATUS.CANCELLED } },
      { session },
    )

    //now create a new subscription data
    const newSubscription = await ShopSubscriptionDataModal.create(
      [
        {
          shop,
          chargeId: charge_id,
          price: chargeStatus.recurring_application_charge.price,
          billingPlan,
          features: billingPlan.featureList.map((feature) => feature.value),
          status: SHOP_SUBSCRIPTION_STATUS.ACTIVE,
        },
      ],
      {
        session,
      },
    )

    //now update the shop model to point to this new shop subcription data
    await ShopsModel.findOneAndUpdate(
      { shop },
      {
        subscriptionData: newSubscription[0]._id,
      },
      { session },
    )
  })

  //return to app
  res.redirect(
    `${SHOPIFY_ADMIN_APP_URL}/billing?shop=${shop}.myshopify.com&host=${host}`,
  )
}
