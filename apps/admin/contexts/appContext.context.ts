import { createContext } from 'react'
import { BillingPlan, ShopInfo } from '@app/common'

export interface AppContextType {
  info: ShopInfo
  billingPlan: BillingPlan | null
}

export const AppContext = createContext<AppContextType>({} as AppContextType)
