import App from "next/app";
import Head from "next/head";
import { AppProvider } from "@shopify/polaris";
import { Provider } from "@shopify/app-bridge-react";
import "@shopify/polaris/dist/styles.css";
import translations from "@shopify/polaris/locales/en.json";
import axios from "axios";
import { getSessionToken } from "@shopify/app-bridge-utils";
import { useAppBridge } from "@shopify/app-bridge-react";
import AppWrapper from "./components/wrapper";

const InitApiAuth = () => {
  const appBridge = useAppBridge();
  //create an axios instance on the window object
  window.api = axios.create();
  // intercept all requests on this axios instance
  window.api.interceptors.request.use(function (config) {
    return getSessionToken(appBridge) // requires an App Bridge instance
      .then((token) => {
        // appending request headers with an authenticated token
        config.url = "/api" + config.url;
        config.headers["Authorization"] = token;
        return config;
      });
  });
  return null;
};

class MyApp extends App {
  static getInitialProps(params) {
    //setting the shop parameter from the url query
    return {
      shop: params.ctx.query.shop,
    };
  }
  render() {
    var { Component, pageProps } = this.props;
    const config = {
      apiKey: API_KEY,
      shopOrigin: this.props.shop,
      forceRedirect: true,
    };
    //Don't render anything on server side
    if (typeof window === `undefined`) return null;
    else
      return (
        <React.Fragment>
          <Head>
            <title>Sample App</title>
            <meta charSet="utf-8" />
          </Head>
          <Provider config={config}>
            <AppProvider i18n={translations}>
              <InitApiAuth></InitApiAuth>
              <AppWrapper>
                <Component {...pageProps} />
              </AppWrapper>
            </AppProvider>
          </Provider>
        </React.Fragment>
      );
  }
}

export default MyApp;
