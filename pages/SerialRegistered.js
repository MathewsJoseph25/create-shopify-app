import React from "react";
import { Button, Card, Page, FormLayout, TextField } from "@shopify/polaris";

function SerialRegistered() {
  return (
    <>
      <Page title="Serial Registerd">
        <Card>
          <Card.Section>
            <TextField value={this.state.serial} />
          </Card.Section>
        </Card>
      </Page>
    </>
  );
}

export default SerialRegistered;
