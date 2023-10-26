import { ShopSubscriptionData } from './billing.types'

export interface ShopInfo {
  address1: string
  address2: string
  checkout_api_supported: boolean
  city: string
  country: string
  country_code: string
  country_name: string
  county_taxes: null | true
  created_at: string
  customer_email: string
  currency: string
  domain: string
  enabled_presentment_currencies: string[]
  eligible_for_card_reader_giveaway: boolean
  eligible_for_payments: boolean
  email: string
  finances: boolean
  force_ssl: boolean
  google_apps_domain: boolean
  google_apps_login_enabled: boolean
  has_discounts: boolean
  has_gift_cards: boolean
  has_storefront: boolean
  iana_timezone: string
  id: number
  latitude: number
  longitude: number
  money_format: string
  money_in_emails_format: string
  money_with_currency_format: string
  money_with_currency_in_emails_format: string
  multi_location_enabled: boolean
  myshopify_domain: string
  name: string
  password_enabled: boolean
  phone: string
  plan_display_name: string
  pre_launch_enabled: boolean
  plan_name: string
  primary_locale: string
  primary_location_id: number
  province: string
  province_code: string
  requires_extra_payments_agreement: boolean
  setup_required: boolean
  shop_owner: string
  source: string // handle of partner account who reffered this shop
  taxes_included: boolean | null
  tax_shipping: boolean | null
  timezone: string
  transactional_sms_disabled: boolean
  updated_at: string
  weight_unit: string
  zip: string
  marketing_sms_consent_enabled_at_checkout: boolean
}

export interface Shop {
  shop: string
  accessToken: string | null
  scopes: string
  nonce: string
  info: ShopInfo
  subscriptionData: ShopSubscriptionData | null
  isInstalled: boolean
  installedOn: Date | null
  uninstalledOn: Date | null
}
