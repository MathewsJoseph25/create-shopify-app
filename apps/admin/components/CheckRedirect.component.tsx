'use client'
import { useSearchParams } from 'next/navigation'
import { Redirect } from '@shopify/app-bridge/actions'
import { useAppBridge } from '@shopify/app-bridge-react'

export function CheckRedirect() {
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirect')
  const appBridge = useAppBridge()
  if (redirectUrl) {
    const redirect = Redirect.create(appBridge)
    redirect.dispatch(Redirect.Action.REMOTE, decodeURIComponent(redirectUrl))
  }
  return null
}
