'use client'
import { AppContext } from '@/contexts/appContext.context'
import { useContext, useCallback } from 'react'
import { Page, Layout, Text, Card, BlockStack, Button } from '@shopify/polaris'
import { useShopifyGraphQl } from '@/hooks/useShopifyGraphQl.hook'
import { useShopifyRestApi } from '@/hooks/useShopifyRestApi.hook'
import { useAppBridge } from '@shopify/app-bridge-react'
import { Redirect } from '@shopify/app-bridge/actions'
import { useRouter } from 'next/navigation'

const MOST_RECENTLY_CREATED_PRODUCTS_GRAPHQL = `
query {
  products(first: 10, reverse: true) {
    edges {
      node {
        id
        title
      }
    }
  }
}
`

function LatestProducts() {
  const appBridge = useAppBridge()

  const {
    data: latestProductsData,
    isError,
    isLoading,
  } = useShopifyGraphQl<{
    data: {
      products: {
        edges: {
          node: {
            id: string
            title: string
          }
        }[]
      }
    }
  }>({ query: MOST_RECENTLY_CREATED_PRODUCTS_GRAPHQL })

  const redirectTo = useCallback((productId: string) => {
    const redirect = Redirect.create(appBridge)
    redirect.dispatch(Redirect.Action.ADMIN_SECTION, {
      section: {
        name: Redirect.ResourceType.Product,
        resource: {
          id: productId.split('/').pop()!,
        },
      },
      newContext: true,
    })
  }, [])

  return (
    <>
      {isLoading
        ? 'Loading products...'
        : isError
        ? 'oops! Something went wrong'
        : latestProductsData.data.products.edges.length == 0
        ? 'No products found'
        : latestProductsData.data.products.edges.map((product) => (
            <a
              style={{
                cursor: 'pointer',
                textDecoration: 'underline',
                display: 'block',
                margin: '10px 0px',
              }}
              key={product.node.id}
              onClick={() => redirectTo(product.node.id)}
            >
              {product.node.title} ({product.node.id})
            </a>
          ))}
    </>
  )
}

function ProductsCount() {
  const { data, isError, isLoading } = useShopifyRestApi<{
    count: number
  }>({ url: '/products/count.json' })

  return (
    <>
      {isLoading
        ? 'Loading product count...'
        : isError
        ? 'oops! Something went wrong'
        : `${data.count} products`}
    </>
  )
}

export default function Home() {
  const appContext = useContext(AppContext)
  const router = useRouter()

  return (
    <Page fullWidth>
      <Layout>
        <Layout.Section variant="oneThird">
          <div style={{ marginTop: 'var(--p-space-500)' }}>
            <Text id="storeDetails" variant="headingMd" as="h2">
              Store details
            </Text>
            <Text tone="subdued" as="p">
              {"Your shop's details"}
            </Text>
          </div>
        </Layout.Section>
        <Layout.Section>
          <Card>
            <Text as="h2" variant="headingMd">
              Store Name
            </Text>
            <Text as="p">{appContext.info.name}</Text>
            <br />
            <Text as="h2" variant="headingMd">
              Shopify plan
            </Text>
            <Text as="p">{appContext.info.plan_name}</Text>
          </Card>
        </Layout.Section>
      </Layout>
      <br />
      <Layout>
        <Layout.Section variant="oneThird">
          <div style={{ marginTop: 'var(--p-space-500)' }}>
            <Text id="products" variant="headingMd" as="h2">
              Products
            </Text>
            <Text tone="subdued" as="p">
              {'No of products on your store'}
            </Text>
          </div>
        </Layout.Section>
        <Layout.Section>
          <Card>
            {appContext.subscriptionData ? (
              <>
                <Text as="h2" variant="headingMd">
                  Total Products
                </Text>
                <Text as="p">
                  <ProductsCount />
                </Text>
                <br />
                <Text as="h2" variant="headingMd">
                  Last 10 published products
                </Text>
                <br />
                <LatestProducts />
              </>
            ) : (
              <>
                <Text as="h2" variant="headingMd">
                  To view product data, please upgrade to a paid plan
                </Text>
                <BlockStack inlineAlign="end">
                  <Button
                    variant="primary"
                    onClick={() => router.push('/billing')}
                  >
                    Go to Billing page
                  </Button>
                </BlockStack>
              </>
            )}
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  )
}
