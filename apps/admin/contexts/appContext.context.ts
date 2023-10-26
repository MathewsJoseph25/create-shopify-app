import { createContext } from 'react'
import { ShopInfo, ShopSubscriptionData } from '@app/common'

export interface AppContextType {
  info: ShopInfo
  subscriptionData: ShopSubscriptionData | null
  formatMoney: (money: string) => string
  refetchShop: () => void
}

export const AppContext = createContext<AppContextType>({} as AppContextType)
