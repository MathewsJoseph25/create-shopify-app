import { useState, useCallback } from "react";

import { Button, Card, Form, FormLayout, TextField } from "@shopify/polaris";
// const Shop = require("../server/models/shop");

// const pushSerial = require("../server/middleware/pushSerial")

const RegForm = () => {
  const [serialNum, setSerialNum] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      let errs = validate();
      setErrors(errs);
      setIsSubmitting(true);
      // const pushSerial = async (shop) => {
      //   try {
      //     await Shop.updateOne(
      //       { shop: shop },
      //       { shop: shop, serialNum: serialNum },
      //       { upsert: true }
      //     );
      //   } catch (error) {
      //     console.log("Error while adding Nonce to Database: ", error);
      //     return false;
      //   }
      // };
      if (serialNum % 9 === 0) {
        console.log(serialNum);
        alert("Thank You");
        try {
          pushSerial();
        } catch (error) {
          console.log(error);
        }
      } else {
        alert("Invalid Serial Number");
      }
    },
    [serialNum]
  );

  const handleSerialChange = useCallback((value) => setSerialNum(value), []);

  const validate = () => {
    let err = {};
    if (!serialNum) {
      err.title = "Serial Number is Required";
    } else if (serialNum % 9 != 0) {
      err.title = "Invalid Serial Number";
    } else {
      err.title = "Thank you";
    }
    return err;
  };

  return (
    <Form
      onSubmit={handleSubmit}
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
  );
};

export default RegForm;
