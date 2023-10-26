import mongoose, { Schema } from 'mongoose'
import { DB_COLLECTIONS } from '@/dbCollections'
import { SHOP_SUBSCRIPTION_STATUS, ShopSubscriptionData } from '@app/common'

const ShopSubscriptionDataSchema = new Schema<ShopSubscriptionData>(
  {
    shop: { type: String, required: true },
    chargeId: { type: Number, default: null },
    price: { type: String, default: null },
    billingPlan: { type: Object, required: true },
    features: { type: [String], default: [] },
    status: { type: String, default: SHOP_SUBSCRIPTION_STATUS.CANCELLED },
  },
  { timestamps: true },
)

export const ShopSubscriptionDataModal = mongoose.model(
  DB_COLLECTIONS.SHOP_SUBSCRIPTION_DATA,
  ShopSubscriptionDataSchema,
)
