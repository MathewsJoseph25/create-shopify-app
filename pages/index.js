import React from "react";
import { EmptyState, Layout, Page } from "@shopify/polaris";
import Link from "next/link";
import { AppStatus } from "../components/wrapper";

const img = "https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg";

export default class Index extends React.Component {
  static contextType = AppStatus;
  render() {
    return (
      <Page>
        <Layout>
          <EmptyState
            heading="Api Demo 1"
            action={{
              content: "Fetch API",
              onAction: this.callApi,
            }}
            image={img}
          >
            <p>
              Click on the button below and open the console to view the data
              returned from server using authenticated api call.{" "}
            </p>
            <Link href={`/api2?shop=${window.shop}`}>
              <a>Another API Demo page</a>
            </Link>
          </EmptyState>
        </Layout>
      </Page>
    );
  }
  callApi = () => {
    console.log("Sending Api Request");
    this.context.showPageLoading();
    window.api.get("/1").then((response) => {
      console.log(response.data);
      this.context.hidePageLoading();
    });
  };
}
