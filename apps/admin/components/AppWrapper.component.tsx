'use client'
import { Provider } from '@shopify/app-bridge-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { AppProvider, TabProps, Tabs } from '@shopify/polaris'
import translations from '@shopify/polaris/locales/en.json'
import { useCallback, useMemo } from 'react'
import { AppContextWrapper } from './AppContextWrapper.component'
import { CheckRedirect } from './CheckRedirect.component'
import { CUSTOM_APP_CREDENTIALS } from '@app/common'

const getShopifyAuthKeys = (shop: string) => {
  if (CUSTOM_APP_CREDENTIALS[shop]) {
    return CUSTOM_APP_CREDENTIALS[shop]
  }
  return {
    SHOPIFY_API_KEY: process.env.NEXT_PUBLIC_SHOPIFY_API_KEY,
    SHOPIFY_API_SECRET_KEY: process.env.SHOPIFY_API_SECRET_KEY,
  } as {
    SHOPIFY_API_KEY: string
    SHOPIFY_API_SECRET_KEY: string
  }
}

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const appBridgeConfig = {
    apiKey: getShopifyAuthKeys(
      (searchParams.get('shop') as string)?.split('.')[0] || '',
    ).SHOPIFY_API_KEY,
    host: searchParams.get('host')!,
    forceRedirect: true,
  }

  const tabs: TabProps[] = useMemo(
    () => [
      {
        id: 'store',
        content: 'Store Info',
      },
      {
        id: 'billing',
        content: 'Billing',
      },
    ],
    [],
  )

  const history = useMemo(
    () => ({ replace: (path: string) => router.push(path) }),
    [router],
  )

  const shopifyClientRouter = useMemo(
    () => ({
      location: pathname,
      history,
    }),
    [pathname, history],
  )

  const onTabChange = useCallback(
    (selectedTabIndex: number) => {
      if (selectedTabIndex == 0) {
        return router.push('/')
      }
      router.push(`/${tabs[selectedTabIndex].id}`)
    },
    [router, tabs],
  )

  const currentPage = pathname.split('/')[1]
  const selectedTab = tabs.findIndex((tab) => tab.id == currentPage)

  return (
    <Provider config={appBridgeConfig} router={shopifyClientRouter}>
      <AppProvider i18n={translations}>
        <CheckRedirect />
        <Tabs
          tabs={tabs}
          selected={selectedTab != -1 ? selectedTab : 0}
          onSelect={onTabChange}
        >
          <AppContextWrapper>{children}</AppContextWrapper>
        </Tabs>
      </AppProvider>
    </Provider>
  )
}
