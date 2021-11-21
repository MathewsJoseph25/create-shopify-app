import { useState, useCallback } from "react";
import { Button, Card, Form, FormLayout, TextField } from "@shopify/polaris";
import axios from "axios";
import { getSessionToken } from "@shopify/app-bridge-utils";
// const Shop = require("../server/models/shop");

// const pushSerial = require("../server/middleware/pushSerial")

const regForm = () => {
  const [serialNum, setSerialNum] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const pushSerial = async (shop) => {
    try {
      await shop.updateOne(
        { shop: shop },
        { shop: shop, serial: serialNum },
        { upsert: true }
      );
      console.log({ shop: shop, serial: serialNum });

    } catch (error) {
      console.log("Error while adding Nonce to Database: ", error);
      return false;
    }
  };

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      let errs = validate();
      setErrors(errs);
      setIsSubmitting(true);
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

  const handleSubmitSerial = async() => {
    try{
    //const token = await getSessionToken();
   // console.log("getSessionToken ::", token);
    //"X-Shopify-Access-Token": token
    axios.post("https://99a8-2405-204-2207-8430-dd98-3126-b06-cd68.ngrok.io/api/regForm",{
      "shop": "tallyecom",
      "serialNumber": serialNum
    }).then((response) => {
      console.log('response :: ',response);
    }).catch((err) => {
      console.log('err: ',err);
    })
  }catch(e){console.log("e ::",e)}
  }

  return (
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
  );
};

export default regForm;
