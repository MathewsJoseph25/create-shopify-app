import { useState, useCallback } from "react";

import { Button, Card, Form, FormLayout, TextField } from "@shopify/polaris";
// import Router from "koa-router";
// import fetch from 'node-fetch';
const Shop = require("../server/models/shop");

const RegForm = () => {
  const [serialNum, setSerialNum] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  //   const router = Router();


  const handleSubmit = useCallback(
    (e) => {
      //   let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczpcL1wvdGFsbHllY29tLm15c2hvcGlmeS5jb21cL2FkbWluIiwiZGVzdCI6Imh0dHBzOlwvXC90YWxseWVjb20ubXlzaG9waWZ5LmNvbSIsImF1ZCI6IjczZWQyOThiODVlYWU2N2E4OGIwZmUzMTdhN2Y2YmNjIiwic3ViIjoiNzI1Njg0NzE3MjgiLCJleHAiOjE2MzM2NzM3MjEsIm5iZiI6MTYzMzY3MzY2MSwiaWF0IjoxNjMzNjczNjYxLCJqdGkiOiIzZWNiNmM4Yi0wN2U5LTRkZmEtYjJmYi01ZmM1Y2YwNmM0YWIiLCJzaWQiOiI5NDI4YWY5YWMxNjNkNjcyYTI4ZTFmMDM1ZmQ4MjNiYzI0MjRiY2U3Y2ZlMDI0ZDBlNjdkNjBiMjU1ZWY0YTUwIn0.ffL5xSYNRpCvPaTuTllepWiQCJTcxMgWqjYjtfspEpQ"
      e.preventDefault();
      let errs = validate();
      setErrors(errs);
      setIsSubmitting(true);
      const getSerialUrl = async (shop) => {
        try {
          await Shop.updateOne(
            { shop: shop },
            { shop: shop, serialNum: serialNum },
            { upsert: true }
          );
        } catch (error) {
          console.log("Error while adding Nonce to Database: ", error);
          return false;
        }
      };
      if (serialNum % 9 === 0) {
        console.log(serialNum);
        alert("Thank You");
        try {
          getSerialUrl();
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

  //   const breadcrumbs = [{ content: "Registration" }, { content: "next.js" }];
  //   const primaryAction = { content: "New Registration" };

  //   const validSerial = !serialNum
  //     ? "Please Provide Tally Serial Number"
  //     : serialNum % 9 != 0
  //     ? "Please Provide Valid Tally Serial Number"
  //     : "Thank you";

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
      preventDefault={true}
      title="Registration"
      method="POST"
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
              // helpText="Please Provide Tally Serial Number"
              // error={errors ? ["Please enter a Serial Number"] : null}
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
