import React, { Component } from "react";
import {
  Form,
  FormLayout,
  TextField,
  Button,
  Layout,
  Banner,
  Page,
  Card,
  Heading,
  List,
  TextContainer,
  DataTable,
  Stack,
  Collapsible,
} from "@shopify/polaris";
import Link from "next/link";

export class gdpr extends Component {
  render() {
    return (
      <>
        <Page>
          <Card>
            <Card.Section title="Privacy Policy">
              <Layout>
                <Layout.Section title="Tallyecom.in Privacy Notice">
                  <Heading element="h1">Tallyecom.in Privacy Notice</Heading>
                  <br />
                  <Heading element="h4">Disclaimer: </Heading>
                  <p>
                    In the event of any discrepancy or conflict, the English
                    version will prevail over the translation.
                  </p>
                  <br />
                  <Heading element="h4">
                    Last updated: October 21, 2020.
                  </Heading>
                  <br />
                  <br />
                  <TextContainer>
                    We know that you care how information about you is used and
                    shared, and we appreciate your trust that we will do so
                    carefully and sensibly. This Privacy Notice describes how
                    Tallyecom collect and process your personal information
                    through its, products, services, and Integration Tools for
                    OpenCart & Shopify and other applications that reference
                    this Privacy Notice (together "Tallyecom Services"). By
                    using Tallyecom Services you agree to our use of your
                    personal information (including sensitive personal
                    information) in accordance with this Privacy Notice, as may
                    be amended from time to time by us at our discretion. You
                    also agree and consent to us collecting, storing,
                    processing, transferring, and sharing your personal
                    information (including sensitive personal information) with
                    third parties or service providers for the purposes set out
                    in this Privacy Notice. Personal information subject to this
                    Privacy Notice will be collected and retained by See-D
                    Solutions, 5, Sai Prasad Building, 1st Floor, Tarabaug, 3rd
                    Mamletdarwadi, Malad (West), Mumbai – 400064.
                  </TextContainer>
                </Layout.Section>
              </Layout>
            </Card.Section>
          </Card>
        </Page>
      </>
    );
  }
}

export default gdpr;
