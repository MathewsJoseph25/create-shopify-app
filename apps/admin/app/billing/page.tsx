'use client'
import { AppContext } from '@/contexts/appContext.context'
import { useAppApi } from '@/hooks/useAppApi.hook'
import { BILLING_PLANS, BillingPlan } from '@app/common'
import { useAppBridge } from '@shopify/app-bridge-react'
import { BlockStack, Button, Card, Page, Text } from '@shopify/polaris'
import { useContext, useState } from 'react'
import { Redirect } from '@shopify/app-bridge/actions'
import { useSearchParams } from 'next/navigation'

export default function Billing() {
  const appContext = useContext(AppContext)
  const searchParms = useSearchParams()
  const appBridge = useAppBridge()
  const { fetchAppApi } = useAppApi()
  const [billingUpgradeInProgress, setBillingUpgradeInProgress] =
    useState<BillingPlan>()

  const changePlan = async (billingPlan: BillingPlan) => {
    try {
      setBillingUpgradeInProgress(billingPlan)
      const res = await fetchAppApi<{
        confirmationUrl: string
      }>({
        url: '/billing/change-plan',
        data: { billingPlan, host: window.host },
      })
      if (res?.confirmationUrl) {
        const redirect = Redirect.create(appBridge)
        redirect.dispatch(
          Redirect.Action.REMOTE,
          decodeURIComponent(res.confirmationUrl),
        )
      } else appContext.refetchShop()
    } catch (error) {
    } finally {
      setBillingUpgradeInProgress(undefined)
    }
  }

  const skuToCheck = appContext.subscriptionData?.billingPlan.sku || 'free'
  let selectedBillingPlanIndex = BILLING_PLANS.findIndex(
    (plan) => plan.sku == skuToCheck,
  )

  return (
    <Page title="Billing">
      <BlockStack>
        <div
          style={{
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap',
          }}
        >
          {BILLING_PLANS.map((plan, idx) => (
            <div style={{ width: '400px' }} key={idx}>
              <Card>
                <Text as="h1" variant="heading3xl">
                  {plan.name}
                </Text>
                <Text as="h3" variant="headingXl">
                  {`$${plan.price}`}
                </Text>
                <div style={{ margin: '10px 0px', height: '100px' }}>
                  <Text as="p" variant="headingSm">
                    Features
                  </Text>
                  {plan.featureList.map((feature, idx) => (
                    <Text as="p" key={idx}>
                      {feature.label}
                    </Text>
                  ))}
                </div>
                {idx == selectedBillingPlanIndex ? (
                  <Button
                    size="medium"
                    fullWidth
                    disabled={Boolean(billingUpgradeInProgress)}
                  >
                    Current plan
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="medium"
                    fullWidth
                    onClick={() => changePlan(plan)}
                    loading={billingUpgradeInProgress?.sku == plan.sku}
                    disabled={
                      Boolean(billingUpgradeInProgress) &&
                      billingUpgradeInProgress?.sku != plan.sku
                    }
                  >
                    {appContext.subscriptionData &&
                    appContext.subscriptionData.billingPlan.price > plan.price
                      ? 'Downgrade'
                      : 'Upgrade'}
                  </Button>
                )}
              </Card>
            </div>
          ))}
        </div>
      </BlockStack>
    </Page>
  )
}
