import React from "react";
import {
  EmptyState,
  Layout,
  Banner,
  Page,
  Card,
  Heading,
  List,
  TextContainer,
} from "@shopify/polaris";
import Link from "next/link";
import { AppStatus } from "../components/wrapper";

const img = "https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg";

export default class Index extends React.Component {
  static contextType = AppStatus;
  render() {
    return (
      <Page>
        <Layout>
          <Layout.Section>
            <Banner>
              <Heading element="h1">Simplified E-Commerce Accounting</Heading>
              <p>
                Create Products, Manage Customers, Track Orders, Keep Accutate
                Records, Easy Statutory Compliances
              </p>
            </Banner>
          </Layout.Section>
          <Layout.Section id="features">
            <Card title="Features">
              <Card.Section>
                <List type="bullet">
                  <List.Item>Scope of Duplication : 0</List.Item>
                  <List.Item>need to Import / Export Data : 0</List.Item>
                  <List.Item>
                    Fully Automated Synchronisation of Orders & Tracking Status
                  </List.Item>
                  <List.Item>
                    Create Stock Item / Group in Tally.ERP9 / Tally Prime with
                    Images and post them as Single / Multi Variant Products on
                    Shopify
                  </List.Item>
                  <List.Item>
                    Order Process :
                    <List type="number">
                      <List.Item>
                        Receive Orders in Tally.ERP9 / Tally Prime as soon as
                        they are booked on Shopify
                      </List.Item>
                      <List.Item>
                        Material dispatch entry is booked in Tally.ERP9 / Tally
                        Prime along with courier details once the Material is
                        Dispatched
                      </List.Item>
                      <List.Item>
                        keep track of material with the link provided in the
                        Tally.ERP9 / Tally Prime interface
                      </List.Item>
                      <List.Item>
                        Sales Entry is booked with necessary adjustment entry
                        for COD Partner / Payment Gateway.
                      </List.Item>
                      <List.Item>
                        Easy reconciliation with COD Partner / Payment Gateway
                      </List.Item>
                      <List.Item>
                        In case Material is returned undelivered / post
                        delivery, Automated rejection note is duly processed
                      </List.Item>
                      <List.Item>
                        Autmoated Reversal is done for COD partner / Payment
                        Gateway
                      </List.Item>
                    </List>
                  </List.Item>
                </List>
              </Card.Section>
              <Card.Section>
                <TextContainer>
                  <a>
                    This app requires additional setup and a TCP file compiled
                    on your Tally Serial Number, Please fill up the{" "}
                  </a>
                  <Link href={`/regform?shop=${window.shop}`}>
                    <a>Registration form</a>
                  </Link>
                </TextContainer>
              </Card.Section>
            </Card>
            <p>
              Click on the button below and open the console to view the data
              returned from server using authenticated api call.{" "}
            </p>
            <Link href={`/api2?shop=${window.shop}`}>
              <a>Another API Demo Page</a>
            </Link>
            <br />
            <Link href={`/introduction?shop=${window.shop}`}>
              <a>Introduction</a>
            </Link>
            <br />
          </Layout.Section>
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
