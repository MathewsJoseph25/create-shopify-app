import { useState, useCallback, useEffect } from "react";
import { Button, Card, Form, FormLayout, TextField } from "@shopify/polaris";
import axios from "axios";
import { getSessionToken } from "@shopify/app-bridge-utils";
import createApp from "@shopify/app-bridge";

const regForm = () => {
  const [serialNum, setSerialNum] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [data, setData] = useState(null);

  const getData = async () => {
    const app = createApp({
      apiKey: API_KEY,
      shopOrigin: shop,
      forceRedirect: true,
    });
    const token = await getSessionToken(app);
    console.log('shop ::', API_KEY);
    try {
      const res = await axios.get("/api/shop?shop=" + shop);
      setData(res.data.data.serial);
      if(res.data.data.serial) {
        setIsSubmitting(true);
      }
    } catch(e) {
      setData(null);
      console.log('ee : ',e);
    }
  }

  useEffect(() => {
    const intialSetup = async () => {
      await getData();
    }
    intialSetup();
  }, []);

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

  const handleSubmitSerial = async () => {
    let errs = validate();
    setErrors(errs);
    setIsSubmitting(true);
    if (serialNum % 9 === 0) {
      const app = createApp({
        apiKey: process.env.API_KEY,
        shopOrigin: shop,
        forceRedirect: true,
      });
      const token = await getSessionToken(app);
      const header = { "X-Shopify-Access-Token": token };
      try {
        axios
          .post("/api/regForm", {
            shop: shop,
            serialNumber: serialNum,
          })
          .then((response) => {
            console.log("response :: ", response);
            alert('Saved success fully');
          })
          .catch((err) => {
            alert('Due to server error could not save. Please try again later.')
            setIsSubmitting(false);
            console.log("err: ", err);
          });
      } catch (e) {
        console.log("e ::", e);
      }
    }
  };
  return (
    <Form
      onSubmit={handleSubmitSerial}
      title="Registration"
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
              disabled={isSubmitting}
            />
          </Card.Section>
        </Card>
        <Card>
          <Card.Section>
            <Button primary fullWidth submit disabled={isSubmitting}>
              Submit
            </Button>
          </Card.Section>
        </Card>
      </FormLayout>
    </Form>
  );
};

export default regForm;
