import React from "react";
import { EmptyState, Layout, Page } from "@shopify/polaris";
import Link from "next/link";

const img = "https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg";

export default class Index extends React.Component {
  render() {
    return (
      <Page>
        <Layout>
          <EmptyState
            heading="Api Demo 2"
            action={{
              content: "Fetch API 2",
              onAction: this.callApi,
            }}
            image={img}
          >
            <p>
              Click on the button below and open the console to view the data
              returned from server using authenticated api call.
            </p>
            <Link href="/">
              <a>First API Demo page</a>
            </Link>
          </EmptyState>
        </Layout>
      </Page>
    );
  }
  callApi() {
    console.log("Sending Api Request");
    window.api.get("/api/2").then(function (response) {
      console.log(response.data);
    });
  }
}
