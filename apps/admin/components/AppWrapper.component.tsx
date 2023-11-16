'use client'
import { Provider } from '@shopify/app-bridge-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { AppProvider, TabProps, Tabs } from '@shopify/polaris'
import translations from '@shopify/polaris/locales/en.json'
import { useCallback, useMemo } from 'react'
import { AppContextWrapper } from './AppContextWrapper.component'
import { CheckRedirect } from './CheckRedirect.component'
import { CUSTOM_APP_API_KEY } from '@app/common'

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const shop = (searchParams.get('shop') as string)?.split('.')[0]

  const appBridgeConfig = {
    apiKey:
      CUSTOM_APP_API_KEY[shop] ||
      (process.env.NEXT_PUBLIC_SHOPIFY_API_KEY as string),
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
