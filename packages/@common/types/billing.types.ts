export interface BillingPlan{
  sku: string
  name: string
  price: string
  featureList: {label:string, value:string}[]
}

export enum ShopSubscriptionStatus{
  ACTIVE='active',
  PENDING='pending',
}

export interface ShopSubscriptionData{
  id: number,
  price: string,
  billingPlan: BillingPlan
  features: string[]
  status: ShopSubscriptionStatus
  createdAt: Date
  updatedAt: Date
}
