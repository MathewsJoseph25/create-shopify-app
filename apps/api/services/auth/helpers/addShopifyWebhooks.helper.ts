import { SHOPIFY_API_VERSION, SHOPIFY_WEBHOOK_URL } from '@/config'
import { trackException } from '@/utils/trackException.util'
import axios from 'axios'

export const addShopifyWebhooks = async (
  shop: string,
  accessToken: string,
  webhooks: string[],
) => {
  const header = {
    'X-Shopify-Access-Token': accessToken,
  }

  let webhooksAdded: { topic: string }[] = []
  //getting all added webhooks if any
  try {
    const getAlreadyAddedWebhooks = await axios({
      method: 'GET',
      url: `https://${shop}.myshopify.com/admin/api/${SHOPIFY_API_VERSION}/webhooks.json`,
      headers: header,
    })
    webhooksAdded = getAlreadyAddedWebhooks.data.webhooks
  } catch (error) {}

  for (var i = 0; i < webhooks.length; i++) {
    let findWebhook = webhooksAdded.find(
      (webhook) => webhook.topic == webhooks[i],
    )

    if (findWebhook) {
      //webhook has already been added
      continue
    }
    //Creating topic payload
    var topic = {
      webhook: {
        topic: webhooks[i],
        address: SHOPIFY_WEBHOOK_URL,
        format: 'json',
      },
    }

    try {
      //creating the webhook
      await axios({
        method: 'POST',
        url: `https://${shop}.myshopify.com/admin/api/${SHOPIFY_API_VERSION}/webhooks.json`,
        headers: header,
        data: topic,
      })
    } catch (error) {
      trackException('While creating webhook', error, { shop })
    }
  }
}
