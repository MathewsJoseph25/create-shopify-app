import React, { useEffect, useState, useCallback } from "react";
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
import axios from "axios";

// const img = "https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg";

const Index = () => {
  const [serialNum, setSerialNum] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  // const [data, setData] = useState(null);
  const [serial, setSerial] = useState("");
  const [process, setProcess] = useState([]);
  const [result, setResult] = useState([]);
  const [orderRec, setOrderRec] = useState(0);
  const [orderDel, setOrderDel] = useState(0);
  const [orderRet, setOrderRet] = useState(0);
  const [Product, setProduct] = useState(0);
  const [Image, setImage] = useState(0);
  const [open, setOpen] = useState(false);

  const getData = async () => {
    try {
      const res = await axios.get("/api/shop?shop=" + shop);
      // console.log(res);
      // console.log(res.data);
      // console.log(res.data.data);
      // console.log(res.data.data.serial);
      setSerial(res.data.data.serial);
      // console.log(res.data.data.process);
      setProcess(res.data.data.process);
      // console.log(process);
      var array = res.data.data.process
        ? res.data.data.process.map(
            ({ date, type, processid, status, url, systemName, ip }) => {
              return [date, type, processid, status, url, systemName, ip];
            }
          )
        : [];
      console.log(array);
      setResult(array);
      setOrderRec(
        process.filter(function (e) {
          return e.type == "order" && e.status == "received";
        }).length
      );
      setOrderDel(
        process.filter(function (e) {
          return e.type == "order" && e.status == "delivered";
        }).length
      );
      setOrderRet(
        process.filter(function (e) {
          return e.type == "order" && e.status == "returned";
        }).length
      );
      setProduct(
        process.filter(function (e) {
          return e.type == "product";
        }).length
      );
      setImage(
        process.filter(function (e) {
          return e.type == "image";
        }).length
      );
      console.log(orderRec);
      console.log(orderDel);
      console.log(orderRet);
      console.log(product);
      console.log(Image);
    } catch (e) {
      setSerial(null);
      setProcess([]);
      setResult([]);
      console.log("ee : ", e);
    }
  };

  useEffect(() => {
    const intialSetup = async () => {
      await getData();
    };
    intialSetup();
  }, []);

  const handleSerialChange = useCallback((value) => setSerialNum(value), []);
  const handleToggle = useCallback(() => setOpen((open) => !open), []);

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
    if (serialNum % 9 === 0 && isSubmitting && errors === null) {
      // console.log({
      //   shop: shop,
      //   serialNumber: serialNum,
      // });

      try {
        axios
          .post("/api/regForm", {
            shop: shop,
            serialNumber: serialNum,
          })
          .catch((err) => {
            console.log("err: ", err);
          });
      } catch (e) {
        console.log("e ::", e);
      }
      setSerial(serialNum);
    }
  };

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
        {serial ? (
          <>
            <Layout.Section>
              <Heading element="h1">Serial Number : </Heading>
              <p>{serial}</p>
            </Layout.Section>
          </>
        ) : null}
        {Product || Image || orderRec || orderDel || orderRet ? (
          <>
            <Layout.Section>
              <Card>
                <Heading element="h1">Processed Data</Heading>
                {Product ? (
                  <>
                    <Heading element="h3">Products Uploaded : </Heading>
                    <p>{Product}</p>
                    <br />
                  </>
                ) : null}
                {Image ? (
                  <>
                    <Heading element="h3">Images Uploaded : </Heading>
                    <p>{Image}</p>
                    <br />
                  </>
                ) : null}
                {orderRec ? (
                  <>
                    <Heading element="h3">Orders Received : </Heading>
                    <p>{orderRec}</p>
                    <br />
                  </>
                ) : null}
                {orderDel ? (
                  <>
                    <Heading element="h3">Orders Delivered : </Heading>
                    <p>{orderDel}</p>
                    <br />
                  </>
                ) : null}
                {orderRec ? (
                  <>
                    <Heading element="h3">Orders Returned : </Heading>
                    <p>{orderRet}</p>
                    <br />
                  </>
                ) : null}

                <Card sectioned>
                  <Stack vertical>
                    <Button
                      onClick={handleToggle}
                      ariaExpanded={open}
                      ariaControls="basic-collapsible"
                    >
                      Show Processed Data
                    </Button>
                    <Collapsible
                      open={open}
                      id="basic-collapsible"
                      transition={{
                        duration: "500ms",
                        timingFunction: "ease-in-out",
                      }}
                      expandOnPrint
                    >
                      <DataTable
                        columnContentTypes={[
                          // "string",
                          "date",
                          "string",
                          "string",
                          "string",
                          "string",
                          "string",
                          "string",
                        ]}
                        headings={[
                          // "id",
                          "Date",
                          "Type",
                          "ProcessID",
                          "Status",
                          "URL",
                          "SystemName",
                          "IP",
                        ]}
                        rows={result}
                      />
                    </Collapsible>
                  </Stack>
                </Card>
              </Card>
            </Layout.Section>
          </>
        ) : null}
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
                      Receive Orders in Tally.ERP9 / Tally Prime as soon as they
                      are booked on Shopify
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
                      Sales Entry is booked with necessary adjustment entry for
                      COD Partner / Payment Gateway.
                    </List.Item>
                    <List.Item>
                      Easy reconciliation with COD Partner / Payment Gateway
                    </List.Item>
                    <List.Item>
                      In case Material is returned undelivered / post delivery,
                      Automated rejection note is duly processed
                    </List.Item>
                    <List.Item>
                      Autmoated Reversal is done for COD partner / Payment
                      Gateway
                    </List.Item>
                  </List>
                </List.Item>
              </List>
            </Card.Section>
            {serial ? null : (
              <Card.Section>
                <TextContainer>
                  <a>
                    This app requires additional setup and a TCP file compiled
                    on your Tally Serial Number, Please fill up the form Below.
                  </a>
                </TextContainer>
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
                <Card.Section>
                  <TextContainer>
                    <a>
                      Click on the button below and open the console to view the
                      data returned from server using authenticated api call.{" "}
                    </a>
                    <Link href={`/api2?shop=${window.shop}`}>
                      <a>Another API Demo Page</a>
                    </Link>
                    <br />
                    <Link href={`/introduction?shop=${window.shop}`}>
                      <a>Introduction</a>
                    </Link>
                    <br />
                  </TextContainer>
                </Card.Section>
              </Card.Section>
            )}
          </Card>
        </Layout.Section>
      </Layout>
      <Card>
        <Card.Section title="Developer">
          <Layout>
            <Layout.Section>
              <Heading>See-D Solutions</Heading>
              <br />
              <p>5, Sai Prasad Building, 1st Floor,</p>
              <p>3rd MamletdarWadi, Malad (West),</p>
              <p>Mumbai - 400064., Maharashtra, India</p>
              <br />
              <p>Support : +919082048148</p>
              <br />
              <p>E-mail : info@tallyecom.in</p>
            </Layout.Section>
          </Layout>
        </Card.Section>
      </Card>
    </Page>
  );
};

export default Index;
