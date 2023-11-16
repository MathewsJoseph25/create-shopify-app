import { useEffect, useState, useCallback } from 'react'
import { useAppBridge } from '@shopify/app-bridge-react'
import { getSessionToken } from '@shopify/app-bridge-utils'
import { Toast } from '@shopify/app-bridge/actions'
import axios from 'axios'

export const useAppApi = <T>(
  req?: { url: string; data?: any },
  dependencies?: any[],
) => {
  const appBridge = useAppBridge()
  const [data, setdata] = useState<T>({} as T)
  const [error, setError] = useState()
  const [isError, setIsError] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  //to show toast from anywhere in the app
  const showToast = useCallback(
    (message: string, isError = false, duration = 5000) => {
      const toastOptions = {
        message,
        isError,
        duration,
      }
      const toastNotice = Toast.create(appBridge, toastOptions)
      toastNotice.dispatch(Toast.Action.SHOW)
    },
    [appBridge],
  )

  //to call our app backend
  const fetchAppApi = useCallback(
    async <T>({ url, data }: { url: string; data?: any }) => {
      const token = await getSessionToken(appBridge)
      try {
        const fetch = await axios<T>({
          url: `${process.env.NEXT_PUBLIC_API_PATH}${url}`,
          method: 'POST',
          data,
          headers: {
            Authorization: token,
          },
        })

        const msg = (fetch.data as any).msg
        if (msg) {
          showToast(msg)
        }

        return fetch.data
      } catch (error: any) {
        console.error(error)
        if (error?.response?.data?.error) {
          showToast(error.response.data.error, true)
        }
        throw error
      }
    },
    [appBridge, showToast],
  )
  //to call shopify's grapql directly from frotend. It acts as a proxy
  const fetchShopifyGql = async <T>({
    query,
    variables,
  }: {
    query: any
    variables?: any
  }) => {
    return await fetchAppApi<T>({
      url: '/shopify-gql/request',
      data: { query, variables },
    })
  }

  const fetchRequest = useCallback(async () => {
    if (!req) return
    try {
      setIsLoading(true)
      setIsError(false)
      setError(undefined)

      const response = await fetchAppApi<T>({ url: req.url, data: req.data })
      setdata(response)
    } catch (error: any) {
      setIsError(true)
      setError(error)
    } finally {
      setIsLoading(false)
    }
  }, [fetchAppApi, req])

  useEffect(() => {
    if (req) fetchRequest()
  }, dependencies || [])

  return {
    showToast,
    fetchAppApi,
    fetchShopifyGql,
    data,
    error,
    isError,
    isLoading,
    refetch: fetchRequest,
  }
}
