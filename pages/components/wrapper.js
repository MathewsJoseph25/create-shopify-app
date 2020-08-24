import React from "react";
import { Spinner, Toast, Frame, Loading } from "@shopify/polaris";
import Router from "next/router";

export const AppStatus = React.createContext();

//This class is responsible for showing the loading bar, spinner and the toast
//and can be accessible by this.context.<function-name> within all the pages except _app.js
export class AppWrapper extends React.Component {
  static contextType = AppStatus;
  state = {
    pageLoading: false,
    loadingBar: false,
    toast: false,
    toastMsg: "Toast",
    toastError: false,
    showPageLoading: () => {
      this.setState({ pageLoading: true });
    },
    hidePageLoading: () => {
      this.setState({ pageLoading: false });
    },
    showLoadingBar: () => {
      this.setState({ loadingBar: true });
    },
    hideLoadingBar: () => {
      this.setState({ loadingBar: false });
    },
    showToast: (msg, error = false) => {
      this.setState({
        toastMsg: msg,
        toastError: error,
        toast: true,
      });
    },
  };

  componentDidMount = () => {
    Router.events.on("routeChangeStart", () => this.state.showPageLoading());
    Router.events.on("routeChangeComplete", () => this.state.hidePageLoading());
    Router.events.on("routeChangeError", () => {
      this.state.hidePageLoading();
      this.state.showToast("Server Error", true);
    });
  };
  render() {
    const loadingPage = this.state.pageLoading ? null : { display: "none" };
    const mainPageDisplay = this.state.pageLoading ? { display: "none" } : null;

    return (
      <AppStatus.Provider value={this.state}>
        <React.Fragment>
          <div style={loadingPage}>
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
              <Spinner accessibilityLabel="Loading" size="large" color="teal" />
            </div>
          </div>
          <div style={mainPageDisplay}>{this.props.children}</div>
          {this.state.loadingBar ? (
            <div>
              <Frame>
                <Loading></Loading>
              </Frame>
            </div>
          ) : null}
          {this.state.toast ? (
            <Frame>
              <Toast
                content={this.state.toastMsg}
                error={this.state.toastError}
                onDismiss={this.closeToast}
              />
            </Frame>
          ) : null}
        </React.Fragment>
      </AppStatus.Provider>
    );
  }

  closeToast = () => {
    this.setState({ toast: false });
  };
}
