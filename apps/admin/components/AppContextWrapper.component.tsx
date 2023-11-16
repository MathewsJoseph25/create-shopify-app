'use client'
import { useAppApi } from '@/hooks/useAppApi.hook'
import { PageLoadingState } from './PageLoadingState.component'
import { AppContext, AppContextType } from '@/contexts/appContext.context'
import { ShopInfo, ShopSubscriptionData } from '@app/common'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

declare global {
  interface Window {
    host: string
  }
}

export function AppContextWrapper({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams()
  useEffect(() => {
    window.host = window.host || searchParams.get('host')!
  }, [])

  const { data, isLoading, isError, refetch } = useAppApi<{
    info: ShopInfo
    subscriptionData: ShopSubscriptionData | null
  }>({
    url: '/auth/get-shop-info',
  })

  const formatMoney = (money: string) => {
    return data.info.money_format
      .replace('{{amount}}', money)
      .replace('{{amount_no_decimals}}', money)
      .replace('{{amount_with_comma_separator}}', money)
      .replace('{{amount_no_decimals_with_comma_separator}}', money)
      .replace('{{amount_with_apostrophe_separator}}', money)
  }

  if (isLoading) return <PageLoadingState />
  if (isError) return <div>Oops! Something went wrong</div>

  return (
    <AppContext.Provider
      value={{
        ...data,
        formatMoney,
        refetchShop: refetch,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
