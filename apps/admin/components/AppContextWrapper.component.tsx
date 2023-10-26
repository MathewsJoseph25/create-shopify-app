import { useAppApi } from '@/hooks/useAppApi.hook'
import { PageLoadingState } from './PageLoadingState.component'
import { AppContext, AppContextType } from '@/contexts/appContext.context'

export function AppContextWrapper({ children }: { children: React.ReactNode }) {
  const { data, isLoading, isError } = useAppApi<AppContextType>({
    url: '/auth/get-shop-info',
  })

  if (isLoading) return <PageLoadingState />
  if (isError) return <div>Oops! Something went wrong</div>

  return <AppContext.Provider value={data}>{children}</AppContext.Provider>
}
