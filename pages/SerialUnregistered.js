import React from "react";
import { Button, Card, Form, FormLayout, TextField } from "@shopify/polaris";
function SerialUnregistered() {
  return (
    <>
      <Form
        onSubmit={handleSubmitSerial}
        // preventDefault={true}
        title="Registration"
        // method="POST"
      >
        <FormLayout>
          <Card>
            <Card.Section>
              <TextField
                value={serialNum}
                onChange={handleSerialChange}
                label="Tally Serial Number"
                type="number"
                maxlength={9}
                minlength={9}
                min="700000000"
                max="800000000"
              />
            </Card.Section>
          </Card>
          <Card>
            <Card.Section>
              <Button primary={true} fullWidth={true} submit>
                Submit
              </Button>
            </Card.Section>
          </Card>
        </FormLayout>
      </Form>
    </>
  );
}

export default SerialUnregistered;
