import { BillingPlan } from '..'

export const BILLING_PLANS: BillingPlan[] = [
  {
    sku: 'free',
    name: 'Free',
    price: 0,
    featureList: [{ label: 'View store info', value: 'view_store_info' }],
  },
  {
    sku: 'starter',
    name: 'Starter',
    price: 29.99,
    featureList: [
      { label: 'View store info', value: 'view_store_info' },
      { label: 'View total product count', value: 'view_product_count' },
      {
        label: 'View latest 10 published products',
        value: 'view_latest_products',
      },
    ],
  },
]
