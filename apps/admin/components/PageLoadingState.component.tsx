'use client'
import { Spinner, Frame, Loading } from '@shopify/polaris'

export function PageLoadingState() {
  return (
    <div>
      <Frame>
        <Loading></Loading>
      </Frame>
      <div
        style={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'fixed',
          top: '0px',
          left: '0px',
        }}
      >
        <Spinner accessibilityLabel="Loading" size="large" />
      </div>
    </div>
  )
}
