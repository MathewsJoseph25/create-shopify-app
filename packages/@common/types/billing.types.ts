export interface BillingPlan {
  sku: string
  name: string
  price: number
  featureList: { label: string; value: string }[]
}

export enum SHOP_SUBSCRIPTION_STATUS {
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
}

export interface ShopSubscriptionData {
  shop: string
  chargeId: number
  price: string
  billingPlan: BillingPlan
  features: string[]
  status: SHOP_SUBSCRIPTION_STATUS
  createdAt: Date
  updatedAt: Date
}
