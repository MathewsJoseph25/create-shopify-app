import mongoose, { Schema } from 'mongoose'
import { DB_COLLECTIONS } from '@/dbCollections'
import { Shop } from '@app/common'

const ShopSchema = new Schema<Shop>(
  {
    shop: { type: String, required: true, unique: true },
    accessToken: { type: String, default: null },
    scopes: { type: String, default: '' },
    nonce: { type: String, default: '' },
    info: { type: Object, default: null },
    billingPlan: { type: Object, default: null },
    isInstalled: { type: Boolean, default: false },
    installedOn: { type: Date, default: null },
    uninstalledOn: { type: Date, default: null },
  },
  { timestamps: true },
)

export const ShopsModel = mongoose.model(DB_COLLECTIONS.SHOPS, ShopSchema)
