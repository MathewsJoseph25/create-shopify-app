import { SHOPIFY_ACCESS_SCOPES, SHOPIFY_API_KEY, SHOPIFY_AUTH_REDIRECT_URL } from "@/config"
import { ShopsModel } from "../models/shop.model"

export const getShopInstallUrl = async (shop:string, pageToRedirect = null) => {
    let nonce = Date.now()
    try {
        await ShopsModel.findOneAndUpdate(
            { shop: shop },
            { shop: shop, nonce: nonce },
            { upsert: true }
        )
    } catch (error) {
        throw error
    }
    let redirectUri = SHOPIFY_AUTH_REDIRECT_URL
    if (pageToRedirect) redirectUri += '?return_to=' + pageToRedirect

    return `https://${shop}.myshopify.com/admin/oauth/authorize?client_id=${SHOPIFY_API_KEY}&scope=${SHOPIFY_ACCESS_SCOPES}&redirect_uri=${redirectUri}&state=${nonce}`
}

