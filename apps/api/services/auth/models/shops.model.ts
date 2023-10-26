import mongoose, { Schema } from 'mongoose'
import { DB_COLLECTIONS } from '@/dbCollections'
import { Shop } from '@app/common'
import mongooseAutoPopulate from 'mongoose-autopopulate'

const ShopSchema = new Schema<Shop>(
  {
    shop: { type: String, required: true, unique: true },
    accessToken: { type: String, default: null },
    scopes: { type: String, default: '' },
    nonce: { type: String, default: '' },
    info: { type: Object, default: null },
    subscriptionData: {
      type: Schema.Types.ObjectId,
      ref: DB_COLLECTIONS.SHOP_SUBSCRIPTION_DATA,
      autopopulate: true,
      default: null,
    },
    isInstalled: { type: Boolean, default: false },
    installedOn: { type: Date, default: null },
    uninstalledOn: { type: Date, default: null },
  },
  { timestamps: true },
)

ShopSchema.plugin(mongooseAutoPopulate)
export const ShopsModel = mongoose.model(DB_COLLECTIONS.SHOPS, ShopSchema)
