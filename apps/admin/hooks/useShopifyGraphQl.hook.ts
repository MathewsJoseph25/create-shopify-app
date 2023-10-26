import { useAppApi } from './useAppApi.hook'

export const useShopifyGraphQl = <T>(
  req?: { query: any; variables?: any },
  dependencies?: any[],
) => {
  const request = useAppApi<T>(
    { url: '/shop/gql-api-proxy', data: req },
    dependencies || [],
  )
  return request
}
