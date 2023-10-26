import { useAppApi } from './useAppApi.hook'

export const useShopifyRestApi = <T>(
  req?: { url: string; data?: any; method?: string },
  dependencies?: any[],
) => {
  const request = useAppApi<T>(
    { url: '/shop/rest-api-proxy', data: req },
    dependencies || [],
  )
  return request
}
