import App from "next/app";
import { useEffect } from "react";
import Head from "next/head";
import { AppProvider, Spinner, Toast, Frame, Loading } from "@shopify/polaris";
import { Provider } from "@shopify/app-bridge-react";
import Router from "next/router";
import "@shopify/polaris/dist/styles.css";
import translations from "@shopify/polaris/locales/en.json";

import axios from "axios";
import { getSessionToken } from "@shopify/app-bridge-utils";
import { useAppBridge } from "@shopify/app-bridge-react";

const InitApiAuth = () => {
  const appBridge = useAppBridge();
  useEffect(() => {
    //create an axios instance on the window object
    window.api = axios.create();
    // intercept all requests on this axios instance
    window.api.interceptors.request.use(function (config) {
      return getSessionToken(appBridge) // requires an App Bridge instance
        .then((token) => {
          // appending request headers with an authenticated token
          config.headers["Authorization"] = token;
          return config;
        });
    });
  });

  return null;
};

class MyApp extends App {
  //To show the loading indicator and error toast
  state = { loading: false, error: false };

  static getInitialProps(params) {
    //setting the shop parameter from the url query
    return {
      shop: params.ctx.query.shop,
    };
  }
  componentDidMount = () => {
    // Binding Loading Events
    Router.events.on("routeChangeStart", () =>
      this.setState({ loading: true, error: false })
    );
    Router.events.on("routeChangeComplete", () =>
      this.setState({ loading: false })
    );
    Router.events.on("routeChangeError", () =>
      this.setState({ loading: false, error: true })
    );
  };
  render() {
    var { Component, pageProps } = this.props;
    const config = {
      apiKey: API_KEY,
      shopOrigin: this.props.shop,
      forceRedirect: true,
    };

    return (
      <React.Fragment>
        <Head>
          <title>Sample App</title>
          <meta charSet="utf-8" />
        </Head>
        <Provider config={config}>
          <AppProvider i18n={translations}>
            <InitApiAuth></InitApiAuth>
            {this.state.loading ? (
              <div>
                <Frame>
                  <Loading></Loading>
                </Frame>
                <div
                  style={{
                    width: "100%",
                    height: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "fixed",
                    top: "0px",
                    left: "0px",
                  }}
                >
                  <Spinner
                    accessibilityLabel="Fetching Page"
                    size="large"
                    color="teal"
                  />
                </div>
              </div>
            ) : (
              <Component {...pageProps} />
            )}
            {this.state.error ? (
              <Frame>
                <Toast
                  content="Server Error"
                  error={true}
                  onDismiss={this.closeToast}
                />
              </Frame>
            ) : null}
          </AppProvider>
        </Provider>
      </React.Fragment>
    );
  }
  closeToast = () => {
    this.setState({ error: false });
  };
}

export default MyApp;
